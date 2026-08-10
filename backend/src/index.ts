import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import pool from "../src/db/index.js";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV ?? "development"}`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(async () => {
    await pool.end();
    console.log("🔌 PostgreSQL pool closed. Bye!");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
