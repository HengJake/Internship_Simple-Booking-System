import { createUser, updateUser, deleteUser, getUser } from "../controllers/user.controllers.js";
import e from "express";

const router = e.Router();

router.get("/", getUser);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;