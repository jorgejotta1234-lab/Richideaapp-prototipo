import Database from 'better-sqlite3';

const db = new Database('rich_ideia.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('creator', 'buyer', 'admin', 'founder')) NOT NULL,
    country TEXT,
    kyc_status TEXT DEFAULT 'pending',
    profile_image TEXT,
    wallet_balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    problem_solved TEXT NOT NULL,
    sector TEXT NOT NULL,
    price REAL NOT NULL,
    maturity_level TEXT NOT NULL,
    description_encrypted TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(creator_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ndas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    idea_id INTEGER NOT NULL,
    signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    UNIQUE(user_id, idea_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(idea_id) REFERENCES ideas(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    idea_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    commission REAL NOT NULL,
    status TEXT CHECK(status IN ('escrow', 'completed', 'disputed', 'cancelled')) DEFAULT 'escrow',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(buyer_id) REFERENCES users(id),
    FOREIGN KEY(seller_id) REFERENCES users(id),
    FOREIGN KEY(idea_id) REFERENCES ideas(id)
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    contract_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(transaction_id) REFERENCES transactions(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    transaction_id INTEGER NOT NULL,
    score INTEGER CHECK(score >= 1 AND score <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(from_user_id) REFERENCES users(id),
    FOREIGN KEY(to_user_id) REFERENCES users(id),
    FOREIGN KEY(transaction_id) REFERENCES transactions(id)
  );

  CREATE TABLE IF NOT EXISTS security_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_type TEXT NOT NULL,
    severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')),
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content_encrypted TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(idea_id) REFERENCES ideas(id),
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  );
`);

// Migration helper: Add missing columns if they don't exist
const migrate = () => {
  const columns = db.prepare("PRAGMA table_info(users)").all();
  const columnNames = columns.map(c => c.name);

  if (!columnNames.includes('profile_image')) {
    try {
      db.exec("ALTER TABLE users ADD COLUMN profile_image TEXT");
      console.log("Migration: Added profile_image to users table");
    } catch (_e) {
      console.error("Migration error (profile_image):", _e);
    }
  }

  if (!columnNames.includes('kyc_status')) {
    try {
      db.exec("ALTER TABLE users ADD COLUMN kyc_status TEXT DEFAULT 'pending'");
    } catch {
      // Ignore
    }
  }

  if (!columnNames.includes('wallet_balance')) {
    try {
      db.exec("ALTER TABLE users ADD COLUMN wallet_balance REAL DEFAULT 0");
    } catch {
      // Ignore
    }
  }
};

migrate();

export default db;
