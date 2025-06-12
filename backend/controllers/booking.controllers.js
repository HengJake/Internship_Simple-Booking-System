import mongoose from "mongoose";
import Booking from "../models/booking.model.js"; // Adjust path if needed
import Resource from "../models/resource.model.js";
import User from "../models/user.model.js";
import {
  convertUTCToMalaysiaISOString,
  convertUTCToMalaysiaTime,
  convertMalaysiaTimeISOToUTC,
  convertMalaysiaTimeToUTC,
} from "../../utility/DateTimeConversion.js";
import { fetchResourceById } from "./resource.controllers.js";
import { fetchUserById } from "./user.controllers.js";

async function validateBooking(booking, checkUserConflict = false) {
  const checkResource = await Resource.findById(booking.resourceId);
  if (!checkResource) {
    return { valid: false, message: "Resource not found" };
  }
  const checkUser = await User.findById(booking.userId);
  if (!checkUser) {
    return { valid: false, message: "User not found" };
  }

  const { resourceId, userId, startTime, endTime } = booking;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = convertMalaysiaTimeToUTC(new Date());

  //   ensure no empty data

  // 1. Start must be before end
  if (start >= end) {
    return { valid: false, message: "Start time must be before end time" };
  }

  // 2. Cannot book in the past
  if (start < now) {
    return { valid: false, message: "Cannot book a time in the past" };
  }

  // 3. Check for overlapping bookings (same resource)
  const conflict = await Booking.findOne({
    resourceId,
    $or: [
      {
        startTime: { $lt: end },
        endTime: { $gt: start },
      },
    ],
  });

  if (conflict) {
    return {
      valid: false,
      message: "This resource is already booked during that time",
    };
  }

  // 4. (Optional) Check if user has overlapping bookings
  if (checkUserConflict) {
    const userConflict = await Booking.findOne({
      userId,
      $or: [
        {
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    });

    if (userConflict) {
      return {
        valid: false,
        message: "You already have a booking at that time",
      };
    }
  }

  // 5. Check against resource availability
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    return { valid: false, message: "Resource not found" };
  }

  // check for date first
  const bookingDay = start.getDay(); // 0 = Sunday, 6 = Saturday
  const availability = resource.availability.find(
    (a) => a.dayOfWeek === bookingDay
  );
  if (!availability) {
    return { valid: false, message: "Resource is not available on this day" };
  }

  const startHour = convertUTCToMalaysiaTime(start);
  const endHour = convertUTCToMalaysiaTime(end);
  availability.startTime = convertUTCToMalaysiaISOString(
    availability.dayOfWeek,
    availability.startTime
  );
  availability.endTime = convertUTCToMalaysiaISOString(
    availability.dayOfWeek,
    availability.endTime
  );

  if (startHour < availability.startTime || endHour > availability.endTime) {
    return {
      valid: false,
      message: `Booking must be between ${availability.startTime} and ${availability.endTime}`,
    };
  }

  return { valid: true };
}

// Get all bookings
export const readBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId")
      .populate("resourceId");

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  const booking = req.body;

  // Validate required fields
  if (
    !booking.userId ||
    !booking.resourceId ||
    !booking.startTime ||
    !booking.endTime
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  let resource;
  let user;

  try {
    resource = await Resource.findById(booking.resourceId);
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: `Resource not found` });
  }

  try {
    user = await User.findById(booking.userId);
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: `User ID not found` });
  }

  // ========================checking for conflict========================
  const validation = await validateBooking(req.body);
  // ===============================

  if (!validation.valid) {
    return res
      .status(400)
      .json({ success: false, message: validation.message });
  }

  try {
    const newBooking = new Booking(booking);
    await newBooking.save();

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Booking ID",
    });
  }

  if (
    !updatedData.userId ||
    !updatedData.resourceId ||
    !updatedData.startTime ||
    !updatedData.endTime
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const resource = await Resource.findById(updatedData.resourceId);
  if (!resource) {
    return res
      .status(404)
      .json({ success: false, message: "Resource not found" });
  }

  // Validate date fields if provided
  if (updatedData.startTime && updatedData.endTime) {
    const start = new Date(updatedData.startTime);
    const end = new Date(updatedData.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before endTime",
      });
    }

    // ========================checking for conflict========================
    const bookingDay = start.getDay();
    const availability = resource.availability.find(
      (a) => a.dayOfWeek === bookingDay
    );

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: "Resource not available on this day",
      });
    }

    const startHour = convertUTCToMalaysiaTime(start);
    const endHour = convertUTCToMalaysiaTime(end);

    let availableStartTime = convertUTCToMalaysiaISOString(
      availability.dayOfWeek,
      availability.startTime
    );

    let availableEndTime = convertUTCToMalaysiaISOString(
      availability.dayOfWeek,
      availability.endTime
    );

    if (startHour < availableStartTime || endHour > availableEndTime) {
      return res.status(400).json({
        success: false,
        message: `Booking must be between ${availability.startTime} and ${availability.endTime}`,
      });
    }

    // Check for booking conflicts (exclude the current booking by id)
    const conflictingBooking = await Booking.findOne({
      _id: { $ne: id }, // exclude current booking
      resourceId: updatedData.resourceId,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "Booking conflicts with an existing booking",
      });
    }
  }
  // =================================================

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Booking ID",
    });
  }

  try {
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ============ More Utils ============

export const readDetailedBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("userId").populate("resourceId");

    const detailedBookings = await Promise.all(
      bookings.map(async (booking) => {

        const user = await User.findById(booking.userId);

        const resource = await fetchResourceById(booking.resourceId);

        // console.log(user)
        // console.log(resource)

        return {
          _id: booking._id,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          user: user,
          resource: resource,
        };
      })
    );

    res.status(200).json({ success: true, data: detailedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getBookingsByResource = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID" });
  }

  try {
    const bookings = await Booking.find({ resourceId: id });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};
