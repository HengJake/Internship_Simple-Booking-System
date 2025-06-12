import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text,
  Input,
  CardFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { getCookie } from "../../../utility/cookieUtils";
import { useUserStore } from "../store/user";
import { useState } from "react";

function Profile() {
  const toast = useToast();

  const [value, setValue] = React.useState("");
  const [emailValue, setEmailValue] = React.useState("");
  const handleChange = (event) => setValue(event.target.value);
  const handleEmailChange = (event) => setEmailValue(event.target.value);

  const [user, setUser] = useState(null);
  const { getUserById, updateUser } = useUserStore();

  // to get the user data from DB

  const fetchUser = async () => {
    const uid = getCookie("UID");

    if (!uid) {
      console.error("No UID found in cookies");
      return;
    }

    const result = await getUserById(uid);
    if (result.success) {
      setUser(result.data);
    } else {
      console.error("Failed to fetch user:", result.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [getUserById]);

  if (!user) return <Text>Loading user...</Text>;

  const handleUpdatedUser = async () => {
    const updatedUser = {
      ...user,
      name: value || user.name,
      email: emailValue || user.email,
    };

    const { success, message } = await updateUser(updatedUser);
    console.log(success, message);
    if (!success) {
      toast({
        title: "Error Updating Profile",
        description: message,
        position: "top",
        status: "error",
        isClosable: true,
      });
    } else {
      toast({
        title: "Profile Updated successfully",
        description: message,
        position: "top",
        status: "success",
        isClosable: true,
      });
    }

    fetchUser();

    
  };

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Card bg={"transparent"}>
        <CardHeader>
          <Heading size="md">My Profile</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box textAlign="center">
              <Text mb="8px" textAlign="center">
                <Box as="span" fontWeight={800}>
                  Previous Name:
                </Box>{" "}
                {user.name}
              </Text>

              <Text mb="8px" textAlign="center">
                <Box as="span" fontWeight={800}>
                  Current Name:
                </Box>{" "}
                {value || user.name}
              </Text>

              <Input
                value={value}
                onChange={handleChange}
                placeholder="Enter new name"
                size="sm"
                mb="8px"
              />
            </Box>
            <Box textAlign="center">
              <Text mb="8px" textAlign="center">
                <Box as="span" fontWeight={800}>
                  Previous Email:
                </Box>{" "}
                {user.email}
              </Text>

              <Text mb="8px" textAlign="center">
                <Box as="span" fontWeight={800}>
                  Current Email:
                </Box>{" "}
                {emailValue || user.email}
              </Text>

              <Input
                value={emailValue}
                onChange={handleEmailChange}
                placeholder="Enter new name"
                size="sm"
                mb="8px"
              />
            </Box>
          </Stack>
        </CardBody>
        <CardFooter justify={"center"}>
          <Button bg={"green.400"} onClick={handleUpdatedUser}>
            Change Details
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
}

export default Profile;
