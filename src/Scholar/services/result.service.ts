import { ICourseResult, IResult, Semester } from "../../Model/result.interface";
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
    semester: Semester,
    results: ICourseResult[]
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

    const currentYear = new Date().getFullYear();
    const defaultSession = `${currentYear - 1}/${currentYear}`;
    const resultSession = session || defaultSession;

    return await this.resultRepo.createResult({
      matNumber,
      session: resultSession,
      semester,
      department: scholar.department,
      level: scholar.level,
      results,
    });
  }

  async getOneResult(
    user: { role?: string; matNumber?: string },
    matNumber: string,
    session: string,
    semester: Semester
  ): Promise<IResult | null> {
    if (user.role === "scholar" && user.matNumber !== matNumber)
      throw new HttpException(
        403,
        "Access denied: You can only access your own result"
      );

    const result = await this.resultRepo.getOneResult(
      matNumber,
      session,
      semester
    );
    if (!result) {
      throw new HttpException(404, "Result not found");
    }

    if (result.results.length === 0)
      throw new HttpException(404, "Result not found");

    return result;
  }

  async getResultsByMatNumber(
    user: { role?: string; matNumber?: string },
    matNumber: string
  ): Promise<IResult[]> {
    if (user.role === "scholar" && user.matNumber !== matNumber)
      throw new HttpException(
        403,
        "Access denied: You can only access your own result"
      );
    const result = await this.resultRepo.getResultsByMatNumber(matNumber);
    if (result.length === 0) throw new HttpException(404, "Result not found");
    return result;
  }

  async updateResult(
    user: { role?: string; matNumber?: string },
    matNumber: string,
    session: string,
    semester: Semester,
    results: ICourseResult[]
  ): Promise<IResult | null> {
    if (user.role !== "admin")
      throw new HttpException(
        403,
        "Access denied: Only admin can update result"
      );

    return this.resultRepo.updateResult(matNumber, session, semester, {
      results,
    });
  }
}
