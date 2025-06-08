import React from "react";
import { Heading, HStack, useColorMode } from "@chakra-ui/react";
import {
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

  return (
    <Card maxW="sm">
      <CardBody p={2}>
        <Stack spacing="3">
          <HStack
            justifyContent={"space-between"}
            bg={bg}
            p={3}
            borderRadius={10}
            flexWrap="wrap"
            alignItems={"center"}
          >
            <Heading size="md">{booking.resourceId.name}</Heading>
            <Box textAlign={["left", "left", "right"]}>
              <Text>{booking.startTime.toLocaleDateString()}</Text>
              <Text color={textColor} fontSize="xs">
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
            </Box>
          </HStack>

          <Text paddingLeft={3}>{booking.resourceId.description}</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter p={2} display={"flex"} justifyContent={"end"}>
        <Button variant="ghost" colorScheme="red" onClick={handleDelete}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
