import React from "react";
import { Heading, HStack, useColorMode, VStack } from "@chakra-ui/react";
import {
  Image,
  Card,
  ButtonGroup,
  Button,
  CardBody,
  Stack,
  Divider,
  CardFooter,
  Text,
  Box,
} from "@chakra-ui/react";
import { useBookingStore } from "../store/booking";
import { useToast } from "@chakra-ui/react";
import LabImage from "../assets/LabImage.jpg";
import MeetingRoom from "../assets/meetingRoomImage.jpg";
import StudyPod from "../assets/studyPodImage.jpg";
import { CiCalendarDate } from "react-icons/ci";
import { CiTimer } from "react-icons/ci";

export default function BookingCard({ booking }) {
  const textColor = useColorMode().colorMode === "light" ? "black" : "white";
  const bg = useColorMode().colorMode === "light" ? "gray.300" : "gray.600";
  const toast = useToast();

  const { deleteBooking } = useBookingStore();
  const handleDelete = async () => {
    const response = await deleteBooking(booking._id);
    if (response.success) {
      toast({
        title: "Booking Cancelled",
        description: response.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to cancel product",
        description: response.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // get image src
  let image;
  if (booking.resourceId.type === "study_pod") {
    image = StudyPod;
  } else if (booking.resourceId.type === "lab_equipment") {
    image = LabImage;
  } else {
    image = MeetingRoom;
  }

  return (
    <Card maxW="sm" display={"flex"} bg={"blue.800"} borderRadius={10} overflow={"hidden"}>
      <CardBody
        padding={"3rem 5rem"}
        bgImage={`url(${image})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        flexGrow={1}
      >
        <VStack
          p={3}
          align={"left"}
          backdropFilter="blur(10px)"
          bg="rgba(255, 255, 255, 0.4)" // translucent glass
          border="1px solid rgba(255, 255, 255, 0.1)"
          boxShadow="lg"
          borderRadius="lg"
          color={"blue.900"}
        >
          <HStack>
            <VStack flexWrap="wrap" alignItems={"left"}>
              <Heading size="md">{booking.resourceId.name}</Heading>
              <HStack>
                <CiCalendarDate size={25} />
                <Text>{booking.startTime.toLocaleDateString()}</Text>
              </HStack>

              <HStack>
                <CiTimer size={25} />
                <Text fontSize="xs">
                  {booking.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {booking.endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <Text>{booking.resourceId.description}</Text>
        </VStack>
      </CardBody>
      <Divider />
      <CardFooter p={2} display={"flex"} justifyContent={"end"}>
        <Button
          variant="ghost"
          colorScheme="red"
          onClick={handleDelete}
          bg={"white"}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
