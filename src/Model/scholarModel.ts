import { Document, InferSchemaType, Schema, model } from "mongoose";

const scholarSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    department: {
      type: String,
      required: false,
      trim: true,
    },

    level: {
      type: Number,
      required: false,
      enum: [100, 200, 300, 400, 500, 600],
    },

    entryYear: {
      type: Number,
    },

    matNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    verifyOtp: {
      type: String,
      default: "",
    },

    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["admin", "scholar"],
      default: "scholar",
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImageId: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type IScholar = InferSchemaType<typeof scholarSchema> & Document;

export const ScholarModel = model<IScholar>("Scholar", scholarSchema);
