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
import {
  convertUTCToMalaysiaTime,
  convertMalaysiaToUTCISOString,
  convertToTimeComponents,
  convertUTCToMalaysiaISOString,
} from "../../../utility/DateTimeConversion";
import { getCookie } from "../../../utility/cookieUtils";

function NewBooking() {
  const { createBooking, getBookingsByResource } = useBookingStore();
  const toast = useToast();

  const [currentDate, setCurrentDate] = useState();
  const [currentTime, setCurrentTime] = useState();

  const [bookedTimeslot, setBookedTimeslot] = useState({});
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [bookings, setBookings] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [newBooking, setNewBooking] = useState({
    userId: getCookie("UID"),
    resourceId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    dateInNum: "",
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

  const fetchBookings = async () => {
    if (selectedResource && selectedResource._id) {
      const result = await getBookingsByResource(selectedResource._id);

      const timeslotMap = {};

      result.data.map((booking) => {
        let MDateTime = [
          convertUTCToMalaysiaTime(new Date(booking.startTime)).toISOString(),
          convertUTCToMalaysiaTime(new Date(booking.endTime)).toISOString(),
        ];

        MDateTime.map((isoString) => {
          // console.log(isoString)
          const [time, date] = convertToTimeComponents(isoString);
          // console.log(time, date)

          // add the date if its not in
          if (!timeslotMap[date]) {
            timeslotMap[date] = [];
          }

          if (!timeslotMap[date].includes(time)) {
            timeslotMap[date].push(time);
          }
        });
      });

      setBookedTimeslot(timeslotMap);
      setBookings(result);
    }
  };

  useEffect(
    () => {
      fetchBookings();
    },
    [selectedResource],
    [bookings]
  );

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

    await fetchBookings();

    setNewBooking((prev) => ({
      ...prev,
      resourceId: selectedResource._id,
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    }));

    setCurrentDate("");
    setCurrentTime("");
  };

  // to get  the weekday between two selected days
  function getWeekdayDatesBetween(startDate, endDate, weekdays) {
    const result = [];
    const date = new Date(startDate);

    while (date <= endDate) {
      const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (weekdays.includes(day)) {
        result.push(new Date(date)); // Clone the date
      }
      date.setDate(date.getDate() + 1);
    }

    return result;
  }

  const today = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(today.getMonth() + 2);
  let availableDateList = [];

  selectedResource
    ? selectedResource.availability.map((slot) =>
        availableDateList.push(slot.dayOfWeek)
      )
    : "";

  const isDateFullyBooked = (dateStr) => {
    if (!selectedResource || !selectedResource.availability) return false;

    const booked = bookedTimeslot[dateStr] || [];
    const totalAvailable = selectedResource.availability.length;

    return booked.length >= totalAvailable;
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack>
        <Heading as={"h1"} fontSize={"25px"} textAlign={"center"}>
          Add New Booking
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("blue.100", "gray.700")}
          p={4}
          rounded={"md"}
          shadow={"md"}
        >
          <SelectResource
            selectedResource={selectedResource}
            setSelectedResource={setSelectedResource}
          />
          <Text mb={3} fontWeight={800}>
            Room availability
          </Text>
          <VStack width={"100%"} align="flex-start">
            <Box display={"flex"} gap={5}>
              <Text fontWeight={700}>Date</Text>
              {
                <Text>
                  {newBooking.dayOfWeek === ""
                    ? "Select a date"
                    : newBooking.dayOfWeek}
                </Text>
              }
            </Box>
            <HStack
              justify="flex-start"
              width={"100%"}
              overflowX={"auto"}
              p={3}
            >
              {getWeekdayDatesBetween(
                today,
                twoMonthsLater,
                availableDateList
              ).map((availableDate) => {
                const dateStr = availableDate.toISOString().split("T")[0];
                const isSelected = currentDate === dateStr;

                return (
                  <Button
                    bg={"blue.700"}
                    color={"white"}
                    minW={"fit-content"}
                    key={availableDate}
                    colorScheme={isSelected ? "blue" : "gray"}
                    variant={isSelected ? "solid" : "outline"}
                    onClick={() => {
                      const selected = availableDate
                        .toISOString()
                        .split("T")[0];
                      setCurrentDate(selected);
                      setNewBooking((prev) => ({
                        ...prev,
                        dayOfWeek: selected,
                      }));
                    }}
                  >
                    {dateStr}
                  </Button>
                );
              })}
            </HStack>
            <HStack>
              <HStack gap={5} mt={3}>
                <Text fontWeight={700}>Time</Text>
                {newBooking.startTime && newBooking.endTime ? (
                  <Text>{`${newBooking.startTime}  - ${newBooking.endTime}`}</Text>
                ) : (
                  <Text>Select Time</Text>
                )}
              </HStack>
            </HStack>
            <HStack justify="flex-start" width={"100%"}>
              {selectedResource &&
              (bookedTimeslot[currentDate] ||
                !isDateFullyBooked(currentDate)) &&
              currentDate ? (
                selectedResource.availability.map((slot) => {
                  const startTime = convertToTimeComponents(
                    convertUTCToMalaysiaISOString(
                      slot.dayOfWeek,
                      slot.startTime
                    )
                  )[0]; // e.g., "09:00"

                  const endTime = convertToTimeComponents(
                    convertUTCToMalaysiaISOString(slot.dayOfWeek, slot.endTime)
                  )[0];

                  const isTimeBooked =
                    bookedTimeslot[currentDate]?.includes(startTime) ?? false;

                  return (
                    <Button
                      bg={"blue.700"}
                      color={"white"}
                      key={slot._id}
                      isDisabled={isTimeBooked}
                      onClick={() => {
                        setCurrentTime(slot.startTime);
                        setNewBooking((prev) => ({
                          ...prev,
                          dayOfWeek: currentDate,
                          startTime: startTime,
                          endTime: endTime,
                          dateInNum: slot.dayOfWeek,
                        }));
                      }}
                    >
                      {isTimeBooked ? (
                        <del>{`${startTime} - ${endTime}`}</del>
                      ) : (
                        `${startTime} - ${endTime}`
                      )}
                    </Button>
                  );
                })
              ) : (
                <Button isDisabled>Select a date...</Button>
              )}
            </HStack>
          </VStack>
          <Button
            color={"white"}
            mt={5}
            bg={"blue.500"}
            w={"100%"}
            onClick={handleAddBooking}
          >
            Book
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}

export default NewBooking;
