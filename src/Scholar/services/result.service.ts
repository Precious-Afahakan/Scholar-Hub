import { IResult } from "../../Model/resultModel";
import { ScholarRepository } from "../repositories/scholar.repository";
import { ResultRepository } from "../repositories/result.repository";
import { HttpException } from "../../utils/httpException";

export class ResultService {
  constructor(
    private resultRepo: ResultRepository,
    private scholarRepo: ScholarRepository
  ) {}

  async uploadResult(
    matNumber: string,
    session: string,
    semester: "First" | "Second",
    results: {
      course: string;
      grade: "A" | "B" | "C" | "D" | "E" | "F";
      score: number;
      unit: number;
    }[]
  ): Promise<IResult> {
    const scholar = await this.scholarRepo.getScholarByMatNo(matNumber);
    if (!scholar) throw new HttpException(404, "Scholar not found");

    if (!scholar.department || !scholar.level) {
      throw new HttpException(
        400,
        "Scholar must have department and level before uploading results"
      );
    }

    const existing = await this.resultRepo.getOneResult(
      matNumber,
      session,
      semester
    );
    if (existing) throw new HttpException(409, "Result already exists");

    return await this.resultRepo.createResult({
      matNumber,
      session: "2025/2026",
      semester,
      department: scholar.department,
      level: scholar.level,
      results: results as any,
    });
  }

  async getResultsByMatNumber(matNumber: string): Promise<IResult[]> {
    return this.resultRepo.getResultsByMatNumber(matNumber);
  }

  async getOneResult(
    matNumber: string,
    session: string,
    semester: "First" | "Second"
  ): Promise<IResult | null> {
    return this.resultRepo.getOneResult(matNumber, session, semester);
  }

  async updateResult(
    matNumber: string,
    session: string,
    semester: "First" | "Second",
    results: {
      course: string;
      score: number;
      grade: "A" | "B" | "C" | "D" | "E" | "F";
      unit: number;
    }[]
  ): Promise<IResult | null> {
    return this.resultRepo.updateResult(matNumber, session, semester, {
      results: results as any,
    });
  }
}
