import { ModelLoader } from "@/types";

import { initCompany } from "./company.model";
import { initEmployee } from "./employee.model";
import { initProject } from "./project.model";
import { initRelation } from "./relation";

export const loadModels: ModelLoader = (db) => {
  initEmployee(db);
  initCompany(db);
  initProject(db);

  initRelation();
};

export * from "./company.model";
export * from "./employee.model";
export * from "./project.model";
