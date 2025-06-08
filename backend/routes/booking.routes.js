import {
  createBooking,
  readBooking,
  updateBooking,
  deleteBooking,
  readDetailedBooking,
  getBookingsByResource
} from "../controllers/booking.controllers.js";
import e from "express";

const router = e.Router();

router.get("/", readBooking);

router.get("/detail", readDetailedBooking);

router.get("/:id", getBookingsByResource);

router.post("/", createBooking);

router.put("/:id", updateBooking);

router.delete("/:id", deleteBooking);

export default router;
