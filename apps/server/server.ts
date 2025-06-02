import os from "os";
import { createServer } from "http";
import app from "./app";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import { setupSocket } from "./src/sockets";
import cluster from "cluster";

const PORT = parseInt(process.env.PORT || "8000");
const numCPUs = os.cpus().length;
const useClustering = process.env.USE_CLUSTERING === "true";

console.log(`Number of CPUs: ${numCPUs}`);

if (useClustering && cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  console.log(`🚀 Worker ${process.pid} started`);
  (async () => {
    try {
      await connectDB();

      const server = createServer(app);
      setupSocket(server);

      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

      async function shutdown() {
        console.log("Shutting down...");
        server.close();
        await mongoose.connection.close();
        process.exit(0);
      }

      process.on("SIGTERM", shutdown);
      process.on("SIGINT", shutdown);
      process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection:", reason);
      });
      // process.on("uncaughtException", (err) => {
      //   console.error("Uncaught Exception:", err);
      //   process.exit(1);
      // });
    } catch (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  })();
}
