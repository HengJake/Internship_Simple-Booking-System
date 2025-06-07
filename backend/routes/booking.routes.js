import { createBooking, readBooking, updateBooking, deleteBooking } from "../controllers/booking.controllers.js";
import e from "express";

const router = e.Router();

router.get("/", readBooking);

router.post("/", createBooking);

router.put("/:id", updateBooking);

router.delete("/:id", deleteBooking);

export default router;