import { ScholarRepository } from "../repositories/scholar.repository";
import { IScholar } from "../../Model/scholarModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginDTO, RegisterDTO } from "../../Model/dto";
import { HttpException } from "../../utils/httpException";
import { EmailService } from "../../config/mailer";
import cloudinary from "../../config/cloudinary";
import { generateMatNumber } from "../../utils/generateMatNumber";

export class ScholarService {
  private repo: ScholarRepository;
  private mailer: EmailService;
  constructor() {
    this.repo = new ScholarRepository();
    this.mailer = new EmailService();
  }

  private async generateToken(scholar: IScholar) {
    return jwt.sign(
      {
        id: scholar._id,
        email: scholar.email,
        role: scholar.role,
        matNumber: scholar.matNumber ?? null,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "3h" }
    );
  }

  private async generateUniqueMatNumber(
    department?: string,
    entryYear?: number
  ): Promise<string> {
    let matNumber: string;
    let exist = true;

    while (exist) {
      matNumber = generateMatNumber(department, entryYear);
      const scholar = await this.repo.getScholarByMatNo(matNumber);
      exist = !!scholar;
    }

    return matNumber!;
  }

  private sanitizeScholar(scholar: IScholar) {
    const obj = scholar.toObject();

    delete obj.password;
    delete obj._v;
    delete obj.createdAt;
    delete obj.updatedAt;

    return obj;
  }

  async Register(
    scholarInput: RegisterDTO
  ): Promise<{ scholar: IScholar; token: string }> {
    const scholarExists = await this.repo.getScholarByEmail(scholarInput.email);
    if (scholarExists) throw new HttpException(401, "Scholar already exists");

    const hashedPassword = await bcrypt.hash(scholarInput.password, 10);

    const entryYear = scholarInput.entryYear ?? new Date().getFullYear();

    const matNumber = await this.generateUniqueMatNumber(
      scholarInput.department,
      entryYear
    );

    const scholar = await this.repo.createScholar({
      ...scholarInput,
      password: hashedPassword,
      matNumber,
    });

    const token = await this.generateToken(scholar);

    return { scholar: this.sanitizeScholar(scholar), token };
  }

  async RegisterAdmin(
    adminInput: RegisterDTO
  ): Promise<{ admin: IScholar; token: string }> {
    const adminExists = await this.repo.getScholarByEmail(adminInput.email);
    if (adminExists) throw new HttpException(401, "Admin already exists");

    const hashedPassword = await bcrypt.hash(adminInput.password, 10);
    const admin = await this.repo.createScholar({
      ...adminInput,
      password: hashedPassword,
      role: "admin",
    });

    const token = await this.generateToken(admin);

    return { admin: this.sanitizeScholar(admin), token };
  }

  async Login(scholarInput: LoginDTO) {
    const scholar = await this.repo.getScholarByEmail(scholarInput.email);
    if (!scholar) throw new HttpException(400, "Scholar not found");
    const match = await bcrypt.compare(scholarInput.password, scholar.password);
    if (!match) throw new HttpException(401, "Invalid credentials");

    const token = await this.generateToken(scholar);

    return { scholar: this.sanitizeScholar(scholar), token };
  }

  async uploadProfilePicture(
    scholarId: string,
    imageUrl: string,
    publicId: string
  ) {
    const scholar = await this.repo.getOneScholar(scholarId);
    if (!scholar) throw new HttpException(404, "Scholar not found");

    if (scholar.profileImageId)
      await cloudinary.uploader.destroy(scholar.profileImageId);

    const updated = await this.repo.updateScholar(scholarId, {
      profileImage: imageUrl,
      profileImageId: publicId,
    });

    if (!updated) throw new HttpException(404, "Image Upload failed");

    return updated;
  }

  async forgotPassword(email: string) {
    const scholar = await this.repo.getScholarByEmail(email);
    if (!scholar) throw new HttpException(400, "Scholar not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const update = {
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 10 * 60 * 1000,
    };

    await this.repo.updateScholar(scholar._id.toString(), update);

    await this.mailer.sendMail(
      email,
      "Password reset OTP",
      `Here's your OTP ${otp}, it expires in 10 minutes`
    );

    return { message: "OTP sent successfully" };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const scholar = await this.repo.getScholarByEmail(email);
    if (!scholar) throw new HttpException(401, "Scholar not found");
    if (scholar.verifyOtp !== otp) throw new HttpException(401, "Invalid OTP");
    if (scholar.verifyOtpExpireAt < Date.now())
      throw new HttpException(401, "OTP Expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.updateScholar(scholar._id.toString(), {
      password: hashedPassword,
      verifyOtp: "",
      verifyOtpExpireAt: 0,
    });

    return { message: "Password reset successful" };
  }

  async getOneScholar(id: string) {
    const scholar = await this.repo.getOneScholar(id);
    if (!scholar) throw new HttpException(400, "Scholar not found");
    return scholar;
  }

  async getAllScholars() {
    const scholars = await this.repo.getAllScholars();
    if (!scholars) throw new HttpException(401, "An error occurred");
    return scholars;
  }

  async updateScholar(id: string, update: Partial<IScholar>) {
    const updated = await this.repo.updateScholar(id, update);
    if (!updated) throw new HttpException(400, "Update failed");
    return updated;
  }

  async deleteScholar(id: string) {
    const deleted = await this.repo.deleteScholar(id);
    if (!deleted) throw new HttpException(400, "Delete failed");
    return true;
  }
}
