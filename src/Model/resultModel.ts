import {
  Document,
  InferSchemaType,
  model,
  Schema,
  HydratedDocument,
} from "mongoose";

const courseResultSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
      enum: ["A", "B", "C", "D", "E", "F"],
    },
    unit: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const resultSchema = new Schema(
  {
    matNumber: {
      type: String,
      required: true,
      index: true,
    },

    department: {
      type: String,
      required: true,
    },

    level: {
      type: Number,
      required: true,
      enum: [100, 200, 300, 400, 500, 600],
    },

    session: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      required: true,
      enum: ["First", "Second"],
    },

    results: {
      type: [courseResultSchema],
      required: true,
    },
  },
  { timestamps: true }
);

resultSchema.index({ matNumber: 1, session: 1, semester: 1 }, { unique: true });

export type IResult = HydratedDocument<InferSchemaType<typeof resultSchema>>;

export const ResultModel = model<IResult>("Result", resultSchema);
