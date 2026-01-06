import { IResult, ResultModel } from "../../Model/resultModel";

export class ResultRepository {
  async createResult(resultInput: Partial<IResult>): Promise<IResult> {
    return await ResultModel.create(resultInput);
  }

  async getOneResult(
    matNumber: string,
    session: string,
    semester: string
  ): Promise<IResult | null> {
    return await ResultModel.findOne({ matNumber, session, semester });
  }

  async getResultsByMatNumber(matNumber: string): Promise<IResult[]> {
    return await ResultModel.find({ matNumber }).sort({ createdAt: 1 });
  }

  async updateResult(
    matNumber: string,
    session: string,
    semester: string,
    update: Partial<IResult>
  ) {
    return await ResultModel.findOneAndUpdate(
      { matNumber, session, semester },
      update,
      { new: true, runValidators: true }
    );
  }
}
