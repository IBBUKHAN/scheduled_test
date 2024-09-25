const { Pool } = require("pg");
const utf8 = require("utf8");
const base64 = require("base-64");

// PostgreSQL connection configuration
const pool = new Pool({
  host: "postgres.gcp.corover.ai",
  database: "postgres",
  user: "postgres",
  password: "PVc)4tWX$oMB",
});

async function updateUserTokens() {
  const client = await pool.connect();
  try {
    // Fetch user tokens where userToken contains '+91' and dtm matches '2024-09-11'
    const res = await client.query(
      `SELECT "userToken" FROM npci.dashboard 
       WHERE "userToken" ILIKE '%0000000000%' 
       AND dtm ILIKE '%2024-09-11%'`
    );

    for (const row of res.rows) {
      const userToken = row.userToken;

      // Check if the userToken matches the regular expression
      if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(userToken)) {
        // Encode userToken to Base64
        const bytes = utf8.encode(userToken);
        const encodedValue = base64.encode(bytes);

        // Update the userToken in the database
        await client.query(
          `UPDATE npci.dashboard 
           SET "userToken" = $1 
           WHERE "userToken" = $2 
           AND dtm ILIKE '%2024-09-11%'`,
          [encodedValue, userToken]
        );
        console.log(
          `Updated userToken: ${userToken} to encoded value: ${encodedValue}`
        );
      }
    }
  } catch (err) {
    console.error("Error updating userTokens:", err);
  } finally {
    client.release();
  }
}

// Run the update function
updateUserTokens().catch((err) =>
  console.error("Error in updateUserTokens function:", err)
);
