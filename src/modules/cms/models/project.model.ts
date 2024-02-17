import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

import { Company } from "./company.model";

export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: string;
  declare name: string;
  declare companyId: ForeignKey<Company["id"]>;

  declare company?: NonAttribute<Company>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initProject = (db: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "projects",
      sequelize: db,
    },
  );
};
