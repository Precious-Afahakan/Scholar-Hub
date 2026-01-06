import { IScholar, ScholarModel } from "../../Model/scholarModel";

export class ScholarRepository {
  async createScholar(scholarInput: Partial<IScholar>): Promise<IScholar> {
    const scholar = await ScholarModel.create(scholarInput);
    return scholar;
  }

  async getOneScholar(id: string): Promise<IScholar | null> {
    return await ScholarModel.findById(id);
  }

  async getScholarByMatNo(matNumber: string): Promise<IScholar | null> {
    return await ScholarModel.findOne({ matNumber });
  }

  async getScholarByEmail(email: string): Promise<IScholar | null> {
    return await ScholarModel.findOne({ email });
  }

  async getAllScholars(): Promise<IScholar[] | null> {
    return await ScholarModel.find();
  }

  async updateScholar(id: string, update: Partial<IScholar>) {
    return await ScholarModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      upsert: false,
    });
  }

  async deleteScholar(id: string) {
    return await ScholarModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}
