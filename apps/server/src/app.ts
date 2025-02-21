import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});
app.use("/api", routes);

export default app;
