export type CreateProjectParams = {
  id?: string;
  name: string;
  companyId: string;
};

export type ProjectListResponse = {
  id: string;
  name: string;
};
