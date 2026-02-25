import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./src/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "rich-ideia-secret";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role, country } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (name, email, password, role, country) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(name, email, hashedPassword, role, country);
      res.json({ id: result.lastInsertRowid, message: "User registered" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Special case: Founder assignment
    if (email === 'founder@richideia.com' && user.role !== 'founder') {
      db.prepare("UPDATE users SET role = 'founder' WHERE id = ?").run(user.id);
      user.role = 'founder';
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const user = db.prepare("SELECT id, name, email, role, country, wallet_balance, kyc_status, profile_image FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  app.post("/api/users/profile", authenticateToken, (req, res) => {
    const { profile_image } = req.body;
    db.prepare("UPDATE users SET profile_image = ? WHERE id = ?").run(profile_image, req.user.id);
    res.json({ success: true });
  });

  app.post("/api/users/kyc", authenticateToken, (req, res) => {
    // Simulate facial recognition success
    db.prepare("UPDATE users SET kyc_status = 'verified' WHERE id = ?").run(req.user.id);
    res.json({ success: true });
  });

  // Ideas
  app.get("/api/ideas", (req, res) => {
    const ideas = db.prepare(`
      SELECT i.*, u.name as creator_name 
      FROM ideas i 
      JOIN users u ON i.creator_id = u.id 
      WHERE i.status = 'active'
    `).all();
    res.json(ideas);
  });

  app.post("/api/ideas", authenticateToken, (req, res) => {
    if (req.user.role !== 'creator') return res.status(403).json({ error: "Only creators can post ideas" });
    const { title, problem_solved, sector, price, maturity_level, description_encrypted } = req.body;
    const stmt = db.prepare("INSERT INTO ideas (creator_id, title, problem_solved, sector, price, maturity_level, description_encrypted) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const result = stmt.run(req.user.id, title, problem_solved, sector, price, maturity_level, description_encrypted);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/ideas/:id", authenticateToken, (req, res) => {
    const idea = db.prepare("SELECT * FROM ideas WHERE id = ?").get(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    
    // Check if NDA signed
    const nda = db.prepare("SELECT * FROM ndas WHERE user_id = ? AND idea_id = ?").get(req.user.id, req.params.id);
    const isOwner = idea.creator_id === req.user.id;
    
    if (!nda && !isOwner && req.user.role !== 'admin') {
      // Return partial data
      const { description_encrypted: _unused, ...partial } = idea;
      return res.json({ ...partial, nda_required: true });
    }
    
    res.json({ ...idea, nda_required: false });
  });

  // NDAs
  app.post("/api/ndas/sign", authenticateToken, (req, res) => {
    const { idea_id } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO ndas (user_id, idea_id, ip_address) VALUES (?, ?, ?)");
      stmt.run(req.user.id, idea_id, req.ip);
      res.json({ message: "NDA signed successfully" });
    } catch {
      res.status(400).json({ error: "NDA already signed or error occurred" });
    }
  });

  // Wallet & Transactions
  app.get("/api/wallet", authenticateToken, (req, res) => {
    const transactions = db.prepare(`
      SELECT t.*, i.title as idea_title, i.problem_solved, i.sector, i.maturity_level,
             b.name as buyer_name, s.name as seller_name
      FROM transactions t 
      JOIN ideas i ON t.idea_id = i.id 
      JOIN users b ON t.buyer_id = b.id
      JOIN users s ON t.seller_id = s.id
      WHERE t.buyer_id = ? OR t.seller_id = ?
    `).all(req.user.id, req.user.id);
    res.json(transactions);
  });

  app.post("/api/wallet/deposit", authenticateToken, (req, res) => {
    const { amount } = req.body;
    db.prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?").run(amount, req.user.id);
    
    // Log transaction (deposit)
    // We don't have an idea_id for deposits, so we might need to handle this differently or just update balance
    // For simplicity, we just update the balance and return success
    res.json({ success: true, new_balance: amount });
  });

  app.post("/api/transactions/buy", authenticateToken, (req, res) => {
    const { idea_id } = req.body;
    const idea = db.prepare("SELECT * FROM ideas WHERE id = ?").get(idea_id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    
    const buyer = db.prepare("SELECT wallet_balance FROM users WHERE id = ?").get(req.user.id);
    if (buyer.wallet_balance < idea.price) {
      return res.status(400).json({ error: "Insufficient funds in wallet" });
    }

    const commission = idea.price * 0.10;

    const transaction = db.transaction(() => {
      // Deduct from buyer
      db.prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?").run(idea.price, req.user.id);
      
      // Create transaction in escrow
      const stmt = db.prepare("INSERT INTO transactions (buyer_id, seller_id, idea_id, amount, commission, status) VALUES (?, ?, ?, ?, ?, 'escrow')");
      const result = stmt.run(req.user.id, idea.creator_id, idea_id, idea.price, commission);
      
      // Generate contract record
      db.prepare("INSERT INTO contracts (transaction_id, contract_hash) VALUES (?, ?)").run(result.lastInsertRowid, `HASH-${Date.now()}`);
      
      // Notify Seller
      db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)")
        .run(idea.creator_id, "Nova Venda!", `Sua ideia "${idea.title}" foi comprada. O valor está em escrow.`, "success");
      
      // Notify Buyer
      db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)")
        .run(req.user.id, "Compra Realizada", `Você comprou "${idea.title}". O contrato foi gerado.`, "info");

      return result.lastInsertRowid;
    });

    const txId = transaction();
    res.json({ transaction_id: txId, message: "Purchase successful, funds held in escrow" });
  });

  // Notifications
  app.get("/api/notifications", authenticateToken, (req, res) => {
    const notifications = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20").all(req.user.id);
    res.json(notifications);
  });

  app.post("/api/notifications/read", authenticateToken, (req, res) => {
    const { id } = req.body;
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(id, req.user.id);
    res.json({ success: true });
  });

  // Ratings
  app.post("/api/ratings", authenticateToken, (req, res) => {
    const { to_user_id, transaction_id, score, comment } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO ratings (from_user_id, to_user_id, transaction_id, score, comment) VALUES (?, ?, ?, ?, ?)");
      stmt.run(req.user.id, to_user_id, transaction_id, score, comment);
      res.json({ message: "Rating submitted" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/users/:id/ratings", (req, res) => {
    const ratings = db.prepare(`
      SELECT r.*, u.name as from_user_name 
      FROM ratings r 
      JOIN users u ON r.from_user_id = u.id 
      WHERE r.to_user_id = ?
    `).all(req.params.id);
    res.json(ratings);
  });

  // Security & Anti-fraud
  app.post("/api/security/log", (req, res) => {
    const { event_type, severity, details, user_id } = req.body;
    const stmt = db.prepare("INSERT INTO security_logs (user_id, event_type, severity, ip_address, user_agent, details) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(user_id || null, event_type, severity, req.ip, req.headers['user-agent'], details);
    res.json({ success: true });
  });

  app.get("/api/admin/stats", authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'founder') return res.status(403).json({ error: "Unauthorized" });
    const stats = {
      total_users: db.prepare("SELECT COUNT(*) as count FROM users").get().count,
      total_ideas: db.prepare("SELECT COUNT(*) as count FROM ideas").get().count,
      total_volume: db.prepare("SELECT SUM(amount) as sum FROM transactions WHERE status = 'completed'").get().sum || 0,
      total_commission: db.prepare("SELECT SUM(commission) as sum FROM transactions WHERE status = 'completed'").get().sum || 0,
    };
    res.json(stats);
  });

  app.get("/api/admin/security-logs", authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'founder') return res.status(403).json({ error: "Unauthorized" });
    const logs = db.prepare("SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 100").all();
    res.json(logs);
  });

  // Founder exclusive dashboard data
  app.get("/api/founder/full-stats", authenticateToken, (req, res) => {
    if (req.user.role !== 'founder') return res.status(403).json({ error: "Founder access only" });
    
    const stats = {
      users: db.prepare("SELECT id, name, email, role, kyc_status, created_at FROM users ORDER BY created_at DESC").all(),
      ideas: db.prepare("SELECT i.*, u.name as creator_name FROM ideas i JOIN users u ON i.creator_id = u.id ORDER BY i.created_at DESC").all(),
      transactions: db.prepare(`
        SELECT t.*, i.title as idea_title, b.name as buyer_name, s.name as seller_name 
        FROM transactions t 
        JOIN ideas i ON t.idea_id = i.id 
        JOIN users b ON t.buyer_id = b.id 
        JOIN users s ON t.seller_id = s.id 
        ORDER BY t.created_at DESC
      `).all(),
      system_stats: {
        total_users: db.prepare("SELECT COUNT(*) as count FROM users").get().count,
        total_ideas: db.prepare("SELECT COUNT(*) as count FROM ideas").get().count,
        total_volume: db.prepare("SELECT SUM(amount) as sum FROM transactions").get().sum || 0,
        total_commission: db.prepare("SELECT SUM(commission) as sum FROM transactions").get().sum || 0,
        active_chats: db.prepare("SELECT COUNT(DISTINCT idea_id) as count FROM messages").get().count
      }
    };
    res.json(stats);
  });

  // Chat
  app.get("/api/chat/active", authenticateToken, (req, res) => {
    // If buyer: get NDAs signed by me
    // If creator: get NDAs signed for my ideas
    let ndas;
    if (req.user.role === 'creator') {
      ndas = db.prepare(`
        SELECT n.*, i.title as idea_title, u.name as other_party_name, u.id as other_party_id
        FROM ndas n
        JOIN ideas i ON n.idea_id = i.id
        JOIN users u ON n.user_id = u.id
        WHERE i.creator_id = ?
      `).all(req.user.id);
    } else {
      ndas = db.prepare(`
        SELECT n.*, i.title as idea_title, u.name as other_party_name, u.id as other_party_id
        FROM ndas n
        JOIN ideas i ON n.idea_id = i.id
        JOIN users u ON i.creator_id = u.id
        WHERE n.user_id = ?
      `).all(req.user.id);
    }
    res.json(ndas);
  });

  app.get("/api/chat/:idea_id", authenticateToken, (req, res) => {
    const { idea_id } = req.params;
    
    // Check if user is creator or has signed NDA
    const idea = db.prepare("SELECT creator_id FROM ideas WHERE id = ?").get(idea_id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    
    const nda = db.prepare("SELECT * FROM ndas WHERE user_id = ? AND idea_id = ?").get(req.user.id, idea_id);
    const isOwner = idea.creator_id === req.user.id;
    
    if (!nda && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: "NDA signature required to access chat" });
    }

    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name 
      FROM messages m 
      JOIN users u ON m.sender_id = u.id 
      WHERE m.idea_id = ? 
      ORDER BY m.created_at ASC
    `).all(idea_id);
    
    res.json(messages);
  });

  app.post("/api/chat/:idea_id", authenticateToken, (req, res) => {
    const { idea_id } = req.params;
    const { content_encrypted, receiver_id } = req.body;
    
    // Check if user is creator or has signed NDA
    const idea = db.prepare("SELECT creator_id FROM ideas WHERE id = ?").get(idea_id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    
    const nda = db.prepare("SELECT * FROM ndas WHERE user_id = ? AND idea_id = ?").get(req.user.id, idea_id);
    const isOwner = idea.creator_id === req.user.id;
    
    if (!nda && !isOwner) {
      return res.status(403).json({ error: "NDA signature required to send messages" });
    }

    const stmt = db.prepare("INSERT INTO messages (idea_id, sender_id, receiver_id, content_encrypted) VALUES (?, ?, ?, ?)");
    stmt.run(idea_id, req.user.id, receiver_id, content_encrypted);
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
