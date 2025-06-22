import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useResourceStore } from "../store/resource";
import { useState } from "react";
import ResourceCard from "./ResourceCard";

function SelectResource({ selectedResource, setSelectedResource }) {
  const { getResource, resources } = useResourceStore();
  const [index, setIndex] = useState(0);

  // transfer the data to parent element
  useEffect(() => {
    if (resources.length > 0) {
      setSelectedResource(resources[index]);
    }
  }, [resources, index, setSelectedResource]);

  useEffect(() => {
    getResource();
  }, [getResource]);

  // Adjust index when resources change, reset to 0
  useEffect(() => {
    setIndex(0);
  }, [resources]);

  const prevResource = () => {
    setIndex((prev) => (prev === 0 ? resources.length - 1 : prev - 1));
  };

  const nextResource = () => {
    setIndex((prev) => (prev === resources.length - 1 ? 0 : prev + 1));
  };

  // Avoid errors if resources empty
  if (resources.length === 0) {
    return <Box>Loading resources...</Box>;
  }

  return (
    <Box
      minH={"100px"}
      className="selectResource"
      position={"relative"}
      w={"100%"}
      display={"flex"}
      justifyContent={"center"}
      mb={3}
    >
      <Button
        className="selectResource__button left"
        position={"absolute"}
        left={5}
        top={"50%"}
        transform="translateY(-50%)"
        onClick={prevResource}
        bg={{base : "transparent", md : "blue.700", lg : "blue.700"}}
        color={"white"}
        zIndex={10}
      >
        <FaChevronCircleLeft />
      </Button>
      <Button
        bg={{base : "transparent", md : "blue.700", lg : "blue.700"}}
        color={"white"}
        className="selectResource__button right"
        position={"absolute"}
        right={5}
        top={"50%"}
        transform="translateY(-50%)"
        onClick={nextResource}
        zIndex={10}
      >
        <FaChevronCircleRight />
      </Button>
      <ResourceCard key={resources[index]._id} resource={resources[index]} />
    </Box>
  );
}

export default SelectResource;
