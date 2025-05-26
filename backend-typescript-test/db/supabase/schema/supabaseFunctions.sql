-- Function to create a table if it doesn't exist
CREATE OR REPLACE FUNCTION create_table_if_not_exists(table_name text, table_definition text)
RETURNS void AS $$
BEGIN
  EXECUTE 'CREATE TABLE IF NOT EXISTS ' || table_name || ' (' || table_definition || ')';
END;
$$ LANGUAGE plpgsql;

-- Function to create the temp_test_crud table for CRUD testing
CREATE OR REPLACE FUNCTION create_function_create_temp_test_table()
RETURNS void AS $$
BEGIN
  EXECUTE '
  CREATE OR REPLACE FUNCTION create_temp_test_table()
  RETURNS void AS $inner$
  BEGIN
    CREATE TABLE IF NOT EXISTS temp_test_crud (
      id UUID PRIMARY KEY,
      name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END;
  $inner$ LANGUAGE plpgsql;';
END;
$$ LANGUAGE plpgsql; 