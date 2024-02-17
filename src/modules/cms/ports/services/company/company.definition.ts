export type CreateCompanyParams = {
  id?: string;
  name: string;
  baseDomain: string;
};

export type CompanyListResponse = {
  id: string;
  name: string;
  baseDomain: string;
};
