import { createResource, readResource, updateResource, deleteResource } from "../controllers/resource.controllers.js";
import e from "express";

const router = e.Router();

router.get("/", readResource);

router.post("/", createResource);

router.put("/:id", updateResource);

router.delete("/:id", deleteResource);

export default router;