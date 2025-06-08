import { create } from "zustand";
import { convertUTCToMalaysiaTime } from "../../../utility/DateTimeConversion";
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

    console.log(newBooking);
    return { success: false, message: "Testing" };
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
