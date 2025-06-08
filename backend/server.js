import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"
import userRoutes from "./routes/user.route.js"
import resourceRoutes from "./routes/resource.routes.js"
import bookingRoutes from "./routes/booking.routes.js"

dotenv.config();

const app = express();
// allow json to be passed in body
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);


app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});