const { Client } = require('pg')

// PostgreSQL connection config
const client = new Client({
  user: process.env.POSTGRES_USER || 'your_user',
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'your_database',
  password: process.env.POSTGRES_PASSWORD || 'your_password',
  port: process.env.POSTGRES_PORT || 5432,
})

async function modifyTable() {
  try {
    await client.connect()
    console.log('Connected to database')

    // Modify table if needed (example: add a new column)
    await client.query("ALTER TABLE strapi_migrations ADD COLUMN IF NOT EXISTS description TEXT")
    console.log('Modified strapi_migrations table')

    // Insert three records
    const insertQuery = `
      INSERT INTO strapi_migrations (name, time, description)
      VALUES
        ('initial-permissions-setup-001', NOW(), 'First migration entry'),
        ('initial-data-seed-001', NOW(), 'Second migration entry'),
        ('custom-views-seed-001', NOW(), 'Third migration entry')
        ) AS new_entries(name, time, description)
  WHERE NOT EXISTS (
    SELECT 1 FROM strapi_migrations sm WHERE sm.name = new_entries.name
  );`
    
    await client.query(insertQuery)
    console.log('Inserted records into strapi_migrations')
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await client.end()
    console.log('Disconnected from database')
  }
}

modifyTable()