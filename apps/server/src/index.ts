import express from "express";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import { authenticate } from "./middleware/auth.middleware";
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
app.use(express.json());
app.use("/users", authenticate, userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
