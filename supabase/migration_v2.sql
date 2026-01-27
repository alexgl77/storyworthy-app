-- MIGRACIÓN V2: Nuevas funcionalidades
-- Ejecutar en Supabase SQL Editor

-- Agregar campos a la tabla entries
ALTER TABLE entries ADD COLUMN IF NOT EXISTS gratitude_1 TEXT DEFAULT '';
ALTER TABLE entries ADD COLUMN IF NOT EXISTS gratitude_2 TEXT DEFAULT '';
ALTER TABLE entries ADD COLUMN IF NOT EXISTS gratitude_3 TEXT DEFAULT '';
ALTER TABLE entries ADD COLUMN IF NOT EXISTS mood_rating INTEGER DEFAULT 0 CHECK (mood_rating >= 0 AND mood_rating <= 5);
ALTER TABLE entries ADD COLUMN IF NOT EXISTS morning_intention TEXT DEFAULT '';

-- Tabla de reflexiones semanales
CREATE TABLE IF NOT EXISTS weekly_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  most_significant TEXT DEFAULT '',
  pattern_noticed TEXT DEFAULT '',
  different_next_week TEXT DEFAULT '',
  what_went_well TEXT DEFAULT '',
  what_went_wrong TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, week_start)
);

-- Índice para reflexiones
CREATE INDEX IF NOT EXISTS idx_weekly_reflections_user ON weekly_reflections(user_id, week_start DESC);

-- RLS para reflexiones semanales
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reflections"
  ON weekly_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections"
  ON weekly_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
  ON weekly_reflections FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger para updated_at en reflexiones
CREATE TRIGGER update_weekly_reflections_updated_at BEFORE UPDATE ON weekly_reflections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
