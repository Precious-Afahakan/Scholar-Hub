import { IScholar } from "../Model/scholarModel";

export const responseObj = (scholar: IScholar) => {
  return {
    id: scholar._id,
    name: scholar.name,
    email: scholar.email,
    matNumber: scholar.matNumber,
    level: scholar.level,
    entryYear: scholar.entryYear,
    role: scholar.role,
    profileImage: scholar.profileImage,
  };
};
