-- Migration: Add atomic token operations to prevent race conditions (TOCTOU bug)
-- These functions use UPDATE ... SET col = col - N with a WHERE guard,
-- guaranteeing atomicity even under concurrent requests.

-- 1. Deduct a token from a user. Returns true if deduction succeeded, false if insufficient balance.
CREATE OR REPLACE FUNCTION deduct_token(p_user_id UUID, p_amount INT DEFAULT 1)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE users
  SET token_balance = token_balance - p_amount
  WHERE id = p_user_id
    AND token_balance >= p_amount;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

-- 2. Add tokens to a user. Always succeeds.
CREATE OR REPLACE FUNCTION add_tokens(p_user_id UUID, p_amount INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE users
  SET token_balance = token_balance + p_amount
  WHERE id = p_user_id;
END;
$$;

-- 3. Transfer tokens between two users atomically.
--    Returns true if transfer succeeded, false if sender has insufficient balance.
CREATE OR REPLACE FUNCTION transfer_tokens(p_from_id UUID, p_to_id UUID, p_amount INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected INT;
BEGIN
  -- Deduct from sender (only if they have enough)
  UPDATE users
  SET token_balance = token_balance - p_amount
  WHERE id = p_from_id
    AND token_balance >= p_amount;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;

  IF rows_affected = 0 THEN
    RETURN FALSE;
  END IF;

  -- Credit to receiver
  UPDATE users
  SET token_balance = token_balance + p_amount
  WHERE id = p_to_id;

  RETURN TRUE;
END;
$$;

-- 4. Add earnings to advocate balance atomically.
CREATE OR REPLACE FUNCTION add_advocate_earning(p_advocate_id UUID, p_amount NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE advocates
  SET balance = balance + p_amount
  WHERE id = p_advocate_id;
END;
$$;
