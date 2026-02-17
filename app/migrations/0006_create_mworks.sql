-- 音楽制作実績テーブル
CREATE TABLE IF NOT EXISTS mworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  external_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 音楽実績 x ジャンル 中間テーブル
CREATE TABLE IF NOT EXISTS mwork_genres (
  mwork_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (mwork_id, genre_id),
  FOREIGN KEY (mwork_id) REFERENCES mworks(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- 音楽実績 x 役割 中間テーブル
CREATE TABLE IF NOT EXISTS mwork_roles (
  mwork_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  PRIMARY KEY (mwork_id, role_id),
  FOREIGN KEY (mwork_id) REFERENCES mworks(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
