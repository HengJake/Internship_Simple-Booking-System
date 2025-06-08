import { Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./component/NavBar";
import NewBooking from "./pages/NewBooking";
import Login from "./pages/Login";
import MyBooking from "./pages/MyBooking";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import { getCookie } from "../../utility/cookieUtils";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    const authCookie = getCookie("UID"); // change 'authToken' to your cookie name

    if (path !== "/login" && path !== "/" && !authCookie) {
      window.location.href = "/login";
    } else if ((path === "/login" || path === "/") && authCookie) {
      window.location.href = "/newbooking";
    }
  }, [location.pathname, navigate]);

  return (
    <Box minH={"100vh"}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newbooking" element={<NewBooking />} />
        <Route path="/mybooking" element={<MyBooking />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Box>
  );
}

export default App;
