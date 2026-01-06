import express from "express";
import { ResultController } from "../controllers/result.controller";
import { ResultService } from "../services/result.service";
import { ResultRepository } from "../repositories/result.repository";
import { ScholarRepository } from "../repositories/scholar.repository";
import { authMiddleware } from "../../middleware/authHandler";
import { requireAdmin } from "../../middleware/roleMiddleware";

const resultRepo = new ResultRepository();
const scholarRepo = new ScholarRepository();

const resultService = new ResultService(resultRepo, scholarRepo);

const resultController = new ResultController(resultService);

const resultRouter = express.Router();

resultRouter.post("/upload", authMiddleware, requireAdmin, (req, res) =>
  resultController.uploadResult(req, res)
);

resultRouter.get("/:matNumber", authMiddleware, (req, res) =>
  resultController.getResultsByMatNumber(req, res)
);

resultRouter.get("/:matNumber/:session/:semester", authMiddleware, (req, res) =>
  resultController.getOneResult(req, res)
);

resultRouter.patch(
  "/update/:matNumber/:session/:semester",
  authMiddleware,
  requireAdmin,
  (req, res) => resultController.updateResult(req, res)
);

export default resultRouter;
