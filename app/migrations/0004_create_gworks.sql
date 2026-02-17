-- ゲーム制作実績テーブル
CREATE TABLE IF NOT EXISTS gworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  platform TEXT,
  features TEXT,
  development_type TEXT,
  thumbnail_url TEXT,
  external_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ゲーム実績 x 技術スタック 中間テーブル
CREATE TABLE IF NOT EXISTS gwork_techs (
  gwork_id INTEGER NOT NULL,
  tech_id INTEGER NOT NULL,
  PRIMARY KEY (gwork_id, tech_id),
  FOREIGN KEY (gwork_id) REFERENCES gworks(id) ON DELETE CASCADE,
  FOREIGN KEY (tech_id) REFERENCES techs(id) ON DELETE CASCADE
);

-- ゲーム実績 x 役割 中間テーブル
CREATE TABLE IF NOT EXISTS gwork_roles (
  gwork_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  PRIMARY KEY (gwork_id, role_id),
  FOREIGN KEY (gwork_id) REFERENCES gworks(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
