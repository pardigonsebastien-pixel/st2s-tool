/*
  # Create eleves table for ST2S Tool

  1. New Tables
    - `eleves`
      - `eleve_id` (text, primary key) - Student identifier
      - `nom` (text) - Last name
      - `prenom` (text) - First name
      - `photo` (text, nullable) - Photo URL or path
      - `classe` (text, default "1re") - Class level: "1re" or "Tle"
      - `groupe` (text) - Group: "A" or "B"
      - `preTotal` (numeric, default 0) - Pre-total score
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Indexes
    - Composite index on (classe, groupe, nom) for efficient filtering
  
  3. Security
    - Enable RLS on `eleves` table
    - Add policy for authenticated users to read all records
    - Add policy for authenticated users to insert/update records (for CSV import)
*/

CREATE TABLE IF NOT EXISTS eleves (
  eleve_id text PRIMARY KEY,
  nom text NOT NULL,
  prenom text NOT NULL,
  photo text,
  classe text NOT NULL DEFAULT '1re',
  groupe text NOT NULL,
  preTotal numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for efficient filtering by classe, groupe, and sorting by nom
CREATE INDEX IF NOT EXISTS idx_eleves_classe_groupe_nom ON eleves(classe, groupe, nom);

-- Enable Row Level Security
ALTER TABLE eleves ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all student records
CREATE POLICY "Authenticated users can read all students"
  ON eleves FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert student records (for CSV import)
CREATE POLICY "Authenticated users can insert students"
  ON eleves FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update student records
CREATE POLICY "Authenticated users can update students"
  ON eleves FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete student records
CREATE POLICY "Authenticated users can delete students"
  ON eleves FOR DELETE
  TO authenticated
  USING (true);