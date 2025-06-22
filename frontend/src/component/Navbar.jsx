import React from "react";
import {
  Container,
  Flex,
  Text,
  HStack,
  Button,
  useColorMode,
  Box,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { deleteCookie } from "../../../utility/cookieUtils.js";
import { useNavigate } from "react-router-dom";
import { TbBrandBooking } from "react-icons/tb";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const atSignup = location.pathname === "/" || location.pathname === "/login";
  const { colorMode, toggleColorMode } = useColorMode();

  const logoutUser = async () => {
    deleteCookie("UID");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <Container maxW={"100vw"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Box textAlign="center">
          <Link to={atSignup ? "#" : "/mybooking"} aria-label="My Booking">
            <Icon
              borderRadius={15}
              as={TbBrandBooking}
              boxSize={12}
              bgGradient="linear(to-r, blue.800, blue.600)"
              color={"white"}
            />
          </Link>
        </Box>

        <HStack spacing={2} alignItems={"center"}>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun />}
          </Button>

          {atSignup ? (
            ""
          ) : (
            <>
              <Link to={"/newbooking"}>
                <Button>
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>

              <Link to={"/profile"}>
                <Button>
                  <CgProfile fontSize={20} />
                </Button>
              </Link>

              <Button _hover={{ bg: "red.300" }} onClick={logoutUser}>
                <IoIosLogOut fontSize={20} />
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Container>
  );
}

export default NavBar;
