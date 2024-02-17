import { Company } from "./company.model";
import { Employee } from "./employee.model";
import { Project } from "./project.model";

export const initRelation = () => {
  Company.belongsTo(Employee, {
    foreignKey: "ownerId",
    as: "owner",
  });

  Company.hasMany(Project, {
    sourceKey: "id",
    foreignKey: "companyId",
    as: "projects",
  });

  Project.belongsTo(Company, {
    foreignKey: "companyId",
    as: "company",
  });
};
