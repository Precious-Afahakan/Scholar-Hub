import express from "express";
import { ScholarController } from "../controllers/scholar.controller";
import {
  validateLogin,
  validateRegister,
} from "../../middleware/validateMiddleware";
import { authMiddleware } from "../../middleware/authHandler";
import { requireAdmin } from "../../middleware/roleMiddleware";
import { upload } from "../../middleware/multer.upload";

const controller = new ScholarController();

const scholarRouter = express.Router();

//ADMIN REGISTER
scholarRouter.post("/admin-register", validateRegister, (req, res) =>
  controller.RegisterAdmin(req, res)
);
scholarRouter.post("/register", validateRegister, (req, res) =>
  controller.Register(req, res)
);
scholarRouter.post("/login", validateLogin, (req, res) =>
  controller.Login(req, res)
);

scholarRouter.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  controller.uploadProfilePicture.bind(controller)
);

scholarRouter.post("/forgot-password", (req, res) =>
  controller.forgotPassword(req, res)
);
scholarRouter.post("/reset-password", (req, res) =>
  controller.resetPassword(req, res)
);

scholarRouter.get("/get-one/:id", authMiddleware, (req, res) =>
  controller.getOneScholar(req, res)
);

scholarRouter.get("/get-all", authMiddleware, requireAdmin, (req, res) =>
  controller.getAllScholars(req, res)
);

scholarRouter.patch("/update/:id", authMiddleware, (req, res) =>
  controller.updateScholar(req, res)
);

scholarRouter.delete("/delete/:id", authMiddleware, requireAdmin, (req, res) =>
  controller.deleteScholar(req, res)
);
export default scholarRouter;
