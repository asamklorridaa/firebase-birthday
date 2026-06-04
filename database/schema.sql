-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.wishes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_name text NOT NULL CHECK (char_length(sender_name) <= 50),
  message text NOT NULL CHECK (char_length(message) <= 500),
  created_at timestamp with time zone DEFAULT now(),
  likes integer DEFAULT 0,
  CONSTRAINT wishes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender text NOT NULL,
  caption text,
  image text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_pkey PRIMARY KEY (id)
);