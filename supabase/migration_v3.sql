-- MIGRACIÓN V3: Agregar birth_date a user_settings
-- Ejecutar en Supabase SQL Editor

-- Agregar columna birth_date a user_settings
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_user_settings_birth_date ON user_settings(user_id) WHERE birth_date IS NOT NULL;
