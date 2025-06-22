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
import { Link, Link as RouterLink } from "react-router-dom";
import BookingCard from "../component/BookingCard";
import { getCookie } from "../../../utility/cookieUtils";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

function MyBooking() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const headingColor = useColorModeValue("blue.900", "blue.200");

  useEffect(() => {
    onOpen();
  }, [onOpen]);

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
      <Heading mb={10} color={headingColor}>
        My Booking
      </Heading>

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

          <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={5}>
            {sortedBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking}></BookingCard>
            ))}
          </SimpleGrid>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to my side project!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your feedback is appreciated 😁</Text>
            <Text as={"small"}>Contact me under "contact"</Text>
            <ChakraLink
              href="https://hengjake.github.io/JunKai-Portfolio/"
              isExternal
              color="blue.500"
              display={"block"}
            >
              Visit website
            </ChakraLink>
            <Button mt={4} onClick={onClose} colorScheme="blue">
              Got it
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MyBooking;
