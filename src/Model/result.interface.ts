export type Grade = "A" | "B" | "C" | "D" | "E" | "F";
export type Semester = "First" | "Second";

export interface ICourseResult {
  courseCode: string;
  score: number;
  grade: Grade;
  unit: number;
}

export interface IResult {
  matNumber: string;
  department: string;
  level: number;
  session: string;
  semester: Semester;
  results: ICourseResult[];
}
