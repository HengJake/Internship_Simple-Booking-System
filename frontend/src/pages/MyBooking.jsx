import React, { useEffect } from "react";
import {
  Heading,
  Box,
  Text,
  Link as ChakraLink,
  SimpleGrid,
  HStack,
  Select,
} from "@chakra-ui/react";
import { useBookingStore } from "../store/booking";
import { Link as RouterLink } from "react-router-dom";
import BookingCard from "../component/BookingCard";
import { getCookie } from "../../../utility/cookieUtils";
import { useState } from "react";

function MyBooking() {
  const UID = getCookie("UID");
  const { getBooking, bookings } = useBookingStore();
  useEffect(() => {
    getBooking();
  }, [getBooking]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  const userBookings = bookings.filter((b) => b.userId._id === UID);

  const sortedBookings = [...userBookings].sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);

    let result = 0;

    switch (sortBy) {
      case "date":
        result = dateA.toDateString().localeCompare(dateB.toDateString());
        break;
      case "time":
        result = dateA.getTime() - dateB.getTime();
        break;
      case "type":
        result = a.resourceId.type.localeCompare(b.resourceId.type);
        break;
      default:
        result = 0;
    }

    return sortOrder === "asc" ? result : -result;
  });

  return (
    <Box
      w={"100%"}
      flex={1}
      display={"flex"}
      flexDirection={"column"}
      p={10}
      justifyContent={"start"}
      alignItems={"start"}
    >
      <Heading mb={10} color={"blue.900"}>My Booking</Heading>

      {sortedBookings.length === 0 ? (
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
        <Box>
          <HStack mb={4}>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="time">Sort by Time</option>
              <option value="type">Sort by Type</option>
            </Select>

            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </HStack>

          <SimpleGrid columns={Math.min(sortedBookings.length, 3)} spacing={5}>
            {sortedBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking}></BookingCard>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}

export default MyBooking;
