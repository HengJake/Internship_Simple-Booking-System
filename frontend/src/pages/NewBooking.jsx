import {
  Container,
  VStack,
  Heading,
  Box,
  useColorModeValue,
  Input,
  Button,
  useToast,
  Text,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useBookingStore } from "../store/booking";
import SelectResource from "../component/SelectResource";
import { useEffect } from "react";

function NewBooking() {
  const { createBooking, getBookingsByResource } = useBookingStore();
  const toast = useToast();

  const [bookings, setBookings] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [newBooking, setNewBooking] = useState({
    resourceId: "",
    startTime: "",
    endTime: "",
  });

  // this code run when selectedResource state has change
  useEffect(() => {
    if (selectedResource) {
      setNewBooking((prev) => ({
        ...prev,
        resourceId: selectedResource._id,
      }));
    }
  }, [selectedResource]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (selectedResource) {
        if (selectedResource._id) {
          const result = await getBookingsByResource(selectedResource._id);

          result.data.map((booking) => {
            // time is still in UTC
            // console.log(booking.startTime)
          })

          setBookings(result);
        }
      }
    };
    fetchBookings();
  }, [selectedResource]);

  const handleAddBooking = async () => {
    const { success, message } = await createBooking(newBooking);
    console.log(success, message);
    if (!success) {
      toast({
        title: "Error adding booking",
        description: message,
        position: "top",
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Booking added successfully",
        description: message,
        position: "top",
        status: "success",
        isClosable: true,
      });
    }
    setNewBooking({
      resourceId: selectedResource._id,
      startTime: "",
      endTime: "",
    });
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"xl"} textAlign={"center"} mb={8}>
          Add New Booking
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.700")}
          p={6}
          rounded={"md"}
          shadow={"md"}
        >
          <SelectResource
            selectedResource={selectedResource}
            setSelectedResource={setSelectedResource}
          />
          <Text mb={3}>Room availability</Text>
          <HStack>
            {selectedResource ? (
              selectedResource.availability.map((slot) => (
                <Button key={slot._id}>
                  <Text>
                    {slot.startTime} - {slot.endTime}
                  </Text>
                </Button>
              ))
            ) : (
              <Button isDisabled>Loading resource...</Button>
            )}
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default NewBooking;
