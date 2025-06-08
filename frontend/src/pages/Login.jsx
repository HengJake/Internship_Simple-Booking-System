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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { setCookie } from "../../../utility/cookieUtils.js";

function Login() {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const toast = useToast();
  const { loginUser } = useUserStore();

  const showToast = (title, description, status = "info") => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const handleLoginUser = async () => {
    const { email, password } = newUser;

    if (!email || !password) {
      return showToast("Missing Fields", "Please fill in all fields", "error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showToast("Invalid Email", "Please enter a valid email", "error");
    }

    const { success, message, data } = await loginUser(newUser);

    if (!success) {
      showToast("Login Failed", message, "error");

      // Reset specific fields based on the error
      if (message === "Email not found") {
        setNewUser({ ...newUser, email: "" });
      } else if (message === "Incorrect password") {
        setNewUser({ ...newUser, password: "" });
      }

      return;
    }

    // Success login
    showToast("Login Successful", message, "success");

    // Example: store cookie (change to data._id or data.name if needed)
    setCookie("UID", data._id, 10);

    setTimeout(() => navigate("/mybooking"), 1000);
    return;
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"xl"} textAlign={"center"} mb={1}>
          SimpleBook Login
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
              onClick={handleLoginUser}
            >
              Log In
            </Button>
          </VStack>
          <Text mt={3}>
            Don't have an account?
            <ChakraLink
              ml={2}
              as={RouterLink}
              to="/"
              color="blue.500"
              textDecoration="underline"
              _hover={{ color: "white" }}
            >
              Sign Up
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default Login;
