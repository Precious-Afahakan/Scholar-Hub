import { Request, Response } from "express";
import { ResultService } from "../services/result.service";
import { Semester } from "../../Model/result.interface";

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

    const result = await this.resultService.getOneResult(
      user,
      matNumber,
      session,
      semester as Semester
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  }

  async getResultsByMatNumber(req: Request, res: Response) {
    const user = (req as any).user;
    const { matNumber } = req.params;

    const results = await this.resultService.getResultsByMatNumber(
      user,
      matNumber
    );
    res.status(201).json({
      success: true,
      data: results,
    });
  }

  async updateResult(req: Request, res: Response) {
    const user = (req as any).user;
    const { matNumber, session, semester } = req.params;
    const { results } = req.body;

    const updatedResult = await this.resultService.updateResult(
      user,
      matNumber,
      session,
      semester as Semester,
      results
    );

    res.status(201).json({
      success: true,
      mesaage: "Result updated successfully",
      data: updatedResult,
    });
  }
}
