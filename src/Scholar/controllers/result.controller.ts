import { Request, Response } from "express";
import { ResultService } from "../services/result.service";

export class ResultController {
  constructor(private resultService: ResultService) {}

  async uploadResult(req: Request, res: Response) {
    const { matNumber, session, semester, results } = req.body;

    const result = await this.resultService.uploadResult(
      matNumber,
      session,
      semester,
      results
    );

    res.status(201).json({
      success: true,
      message: "Result uploaded successfully",
      data: result,
    });
  }

  async getOneResult(req: Request, res: Response) {
    const user = (req as any).user;
    const { matNumber, session, semester } = req.params;

    if (user.role === "scholar" && user.matNumber !== matNumber) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only access your own result",
      });
    }

    const result = await this.resultService.getOneResult(
      matNumber,
      session,
      semester as "First" | "Second"
    );

    if (!result)
      return res
        .status(404)
        .json({ success: false, message: "Result not found" });

    res.status(201).json({
      success: true,
      data: result,
    });
  }

  async getResultsByMatNumber(req: Request, res: Response) {
    const user = (req as any).user;
    const { matNumber } = req.params;

    if (user.role === "scholar" && user.matNumber !== matNumber) {
      return res.status(403).json({
        success: false,
        messgae: "Access denied: You can only access your own results",
      });
    }

    const results = await this.resultService.getResultsByMatNumber(matNumber);
    res.status(201).json({
      success: true,
      data: results,
    });
  }

  async updateResult(req: Request, res: Response) {
    const user = (req as any).user;
    const { matNumber, session, semester } = req.params;
    const { results } = req.body;

    if (user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Access denied: Only admin can update result" });

    const updatedResult = await this.resultService.updateResult(
      matNumber,
      session,
      semester as "First" | "Second",
      results
    );

    res.status(201).json({
      success: true,
      mesaage: "Result updated successfully",
      data: updatedResult,
    });
  }
}
