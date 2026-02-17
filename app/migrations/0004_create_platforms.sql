-- プラットフォームテーブル
CREATE TABLE IF NOT EXISTS platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- 初期データの投入
INSERT OR IGNORE INTO platforms (name) VALUES ('PC');
INSERT OR IGNORE INTO platforms (name) VALUES ('Windows');
INSERT OR IGNORE INTO platforms (name) VALUES ('Mac');
INSERT OR IGNORE INTO platforms (name) VALUES ('iOS');
INSERT OR IGNORE INTO platforms (name) VALUES ('Android');
INSERT OR IGNORE INTO platforms (name) VALUES ('Web');
