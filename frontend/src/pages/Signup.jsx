import React from "react";
import { useState } from "react";
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
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useUserStore } from "../store/user.js";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../../utility/cookieUtils.js";

function Signup() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { createUser } = useUserStore();

  const handleRegisterUser = async () => {
    // validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setNewUser({
        ...newUser,
        email: "",
      });
      return;
    }

    // Password length validation
    if (newUser.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setNewUser({
        ...newUser,
        password: "",
      });
      return;
    }

    const { success, message, data } = await createUser(newUser);
    console.log(success, message, data);
    
    if (!success) {
      toast({
        title: "Error Registering User",
        description: message,
        position: "top",
        status: "error",
        isClosable: true,
        duration: 1000,
      });
    } else {
      toast({
        title: "Account created successfully",
        description: message,
        position: "top",
        status: "success",
        isClosable: true,
      });
      setNewUser({
        name: "",
        email: "",
        password: "",
      });

      setCookie("UID", data._id, 10);
      setTimeout(() => navigate("/mybooking"), 1000);
      return;
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"xl"} textAlign={"center"} mb={1}>
          Register SimpleBook Account
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.700")}
          p={6}
          rounded={"md"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Enter your name..."
              name="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Enter an email..."
              name="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Input
              placeholder="Enter a password..."
              name="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <Button
              w={"full"}
              colorScheme={"blue"}
              mt={4}
              onClick={handleRegisterUser}
            >
              Register
            </Button>
          </VStack>
          <Text mt={3}>
            Have an account?
            <ChakraLink
              ml={2}
              as={RouterLink}
              to="/login"
              color="blue.500"
              textDecoration="underline"
              _hover={{ color: "white" }}
            >
              Login
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default Signup;
