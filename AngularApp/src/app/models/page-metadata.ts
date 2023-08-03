export type Page = {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
};

export type Pageable = {
  page?: number;
  size?: number;
  sort?: string[];
};
