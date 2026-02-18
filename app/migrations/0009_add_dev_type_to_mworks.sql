-- 音楽制作実績に開発種別を追加
ALTER TABLE mworks ADD COLUMN development_type TEXT DEFAULT 'solo';
