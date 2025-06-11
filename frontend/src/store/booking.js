import { create } from "zustand";
import {
  convertUTCToMalaysiaTime,
  convertMalaysiaTimeISOToUTC,
} from "../../../utility/DateTimeConversion";
import { convertOffsetToTimes } from "framer-motion";

export const useBookingStore = create((set) => ({
  bookings: [],
  setBookings: (bookings) => set({ bookings }),
  createBooking: async (newBooking) => {
    if (
      !newBooking.startTime ||
      !newBooking.endTime ||
      !newBooking.resourceId
    ) {
      return { success: false, message: "All fields are required" };
    }

    const startDateTime = convertMalaysiaTimeISOToUTC(
      new Date(
        `${newBooking.dayOfWeek}T${newBooking.startTime}:00`
      ).toISOString()
    ).toISOString();
    const endDateTime = convertMalaysiaTimeISOToUTC(
      new Date(`${newBooking.dayOfWeek}T${newBooking.endTime}:00`).toISOString()
    ).toISOString();

    newBooking.startTime = startDateTime;
    newBooking.endTime = endDateTime;

    const res = await fetch(`/api/bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    });

    const data = await res.json();

    console.log(data.message);

    if (!data.success) {
      return { success: false, message: "Error creating new booking" };
    }

    set((state) => ({
      bookings: [...state.bookings, data.data],
    }));
    return { success: true, message: "New Booking Created" };
  },
  getBooking: async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();

    // convert the time from UTC to malaysia
    data.data.map(
      (data) => (
        (data.startTime = convertUTCToMalaysiaTime(new Date(data.startTime))),
        (data.endTime = convertUTCToMalaysiaTime(new Date(data.endTime)))
      )
    );

    set({ bookings: data.data });
  },
  deleteBooking: async (id) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      set((state) => ({
        bookings: state.bookings.filter((booking) => booking._id !== id),
      }));
      return { success: true, message: data.message };
    } else {
      console.error("Failed to cancel booking:", data.message);
      return { success: false, message: data.message };
    }
  },
  getBookingsByResource: async (id) => {
    const res = await fetch(`/api/bookings/${id}`);
    const data = await res.json();
    return { success: true, data: data };
  },
}));
