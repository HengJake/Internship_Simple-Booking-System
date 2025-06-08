import React, { useEffect } from "react";
import {
  Heading,
  Box,
  Text,
  Link as ChakraLink,
  SimpleGrid,
} from "@chakra-ui/react";
import { useBookingStore } from "../store/booking";
import { Link as RouterLink } from "react-router-dom";
import BookingCard from "../component/BookingCard";
import { getCookie } from "../../../utility/cookieUtils";

function MyBooking() {
  const { getBooking, bookings } = useBookingStore();
  useEffect(() => {
    getBooking();
  }, [getBooking]);

  const UID = getCookie("UID");

  return (
    <Box display={"flex"} flexDirection={"column"} p={10} justifyContent={"center"} alignItems={"center"}>
      <Heading mb={5}>My Booking</Heading>

      {bookings.length === 0 ? (
        <Text>
          No booking ?{" "}
          <ChakraLink
            as={RouterLink}
            to="/newbooking"
            textDecoration={"underline"}
            color={"blue.500"}
          >
            Create Booking
          </ChakraLink>
        </Text>
      ) : (
        <SimpleGrid columns={3} spacing={5}>
          {bookings.map((booking) => (
            UID === booking.userId._id ? 
            <BookingCard key={booking._id} booking={booking}></BookingCard> : ""
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default MyBooking;
