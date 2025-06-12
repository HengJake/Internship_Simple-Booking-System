import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import resourceRoutes from "./routes/resource.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// allow json to be passed in body
app.use(express.json());

console.log("NODE_ENV check:", process.env.NODE_ENV);
console.log("Is production?", process.env.NODE_ENV === "production");
console.log("Path exists:", path.join(__dirname, "/frontend/dist/index.html"));

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "/frontend/dist");
  console.log("Serving static files from:", staticPath);

  // Serve static files first
  app.use(express.static(staticPath));
}

app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);

if (process.env.NODE_ENV === "production") {
  // Catch-all handler should be LAST
  app.get("*", (req, res) => {
    const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");
    console.log("Serving index.html from:", indexPath);
    res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
