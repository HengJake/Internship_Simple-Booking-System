import { createUser, updateUser, deleteUser, getUser, loginUser } from "../controllers/user.controllers.js";
import e from "express";

const router = e.Router();

router.get("/", getUser);

router.post("/", createUser);

router.post("/login", loginUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;