import { Request, Response } from "express";
import { ScholarService } from "../services/scholar.service";
import { RegisterDTO, LoginDTO } from "../../Model/dto";
import { responseObj } from "../../utils/responseObj";

export class ScholarController {
  private service: ScholarService;
  constructor() {
    this.service = new ScholarService();
  }

  async Register(req: Request, res: Response) {
    const data: RegisterDTO = req.body;
    const { scholar, token } = await this.service.Register({ ...data });

    return res.status(200).json({
      success: true,
      message: "Registration complete",
      scholar: responseObj(scholar),
      token,
    });
  }

  async RegisterAdmin(req: Request, res: Response) {
    const data: RegisterDTO = req.body;
    const { admin, token } = await this.service.RegisterAdmin({ ...data });
    return res.status(200).json({
      success: true,
      message: "Admin Registration complete",
      admin: responseObj(admin),
      token,
    });
  }

  async Login(req: Request, res: Response) {
    const data: LoginDTO = req.body;
    const { scholar, token } = await this.service.Login({ ...data });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      scholar: responseObj(scholar),
      token,
    });
  }

  async uploadProfilePicture(req: Request, res: Response) {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No Image uploaded" });
    }

    const scholarId = (req as any).scholar.id;
    const imageUrl = (req.file as any).path;
    const publicId = (req.file as any).filename;

    const scholar = await this.service.uploadProfilePicture(
      scholarId,
      imageUrl,
      publicId
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!!",
      scholar,
    });
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    await this.service.forgotPassword(email);
    return res
      .status(200)
      .json({ success: true, message: "Otp sent successfully" });
  }

  async resetPassword(req: Request, res: Response) {
    const { email, otp, newPassword } = req.body;
    await this.service.resetPassword(email, otp, newPassword);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  }

  async getOneScholar(req: Request, res: Response) {
    const id: string = req.params.id;
    const scholar = await this.service.getOneScholar(id);
    return res
      .status(200)
      .json({ success: true, message: "Successful!!", scholar });
  }

  async getAllScholars(req: Request, res: Response) {
    const scholars = await this.service.getAllScholars();
    return res.status(200).json({ success: true, scholars });
  }

  async updateScholar(req: Request, res: Response) {
    const id: string = req.params.id;
    const update = req.body;
    const updated = await this.service.updateScholar(id, update);
    return res.status(200).json({ success: true, updated });
  }

  async deleteScholar(req: Request, res: Response) {
    const id: string = req.params.id;
    await this.service.deleteScholar(id);
    return res
      .status(200)
      .json({ success: true, message: "Scholar deleted successfully" });
  }
}
