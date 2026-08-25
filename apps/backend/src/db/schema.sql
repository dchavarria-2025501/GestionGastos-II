-- Script de creacion de esquema para GestionGastos
-- Motor: PostgreSQL (probado con pgAdmin4)
--
-- IMPORTANTE: ya NO es necesario ejecutar este script a mano ni crear la
-- base de datos "gestor_gastos_db" desde pgAdmin4. El backend la crea
-- automaticamente (base de datos y tabla) la primera vez que arranca,
-- siempre que el servicio de PostgreSQL este corriendo y las credenciales
-- de apps/backend/.env sean correctas para esta computadora.
--
-- Este script se deja disponible solo como referencia o para revision
-- academica de la estructura de la base de datos.

-- Necesaria para generar UUID con gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre         VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
