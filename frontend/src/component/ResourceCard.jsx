import React from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

export default function ResourceCard({ resource }) {
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  return (
    <Card bg={"blue.700"} color={"white"} flex={0.5}>
      <CardHeader size={"m"} fontWeight={700} p={5}>
        {resource.name}
      </CardHeader>
      <CardBody p={3}>
        <Text>Location : {resource.location}</Text>
        <Text>Type : {resource.type}</Text>
      </CardBody>
    </Card>
  );
}
