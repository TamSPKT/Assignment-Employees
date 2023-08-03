import { HalLink, HalResource } from './hal-types/hal';
import { Manager } from './manager';
import { Page } from './page-metadata';

export type Employee = {
  firstName: string;
  lastName: string;
  description: string;
  manager?: Manager;
};

export type EmployeeResource = HalResource & {
  manager: Manager;
  _links: {
    employee: HalLink;
  };
} & Employee;

export type EmployeeEmbeddedResource = HalResource & {
  _embedded: {
    employees: EmployeeResource[];
  };
  _links: {
    first?: HalLink;
    prev?: HalLink;
    next?: HalLink;
    last?: HalLink;
    profile: HalLink;
  };
  page: Page;
};

export type EmployeeXSpringDataCompactJson = {
  links: XSpringDataCompactJsonLink[];
  content: [];
  page: Page;
};

export type XSpringDataCompactJsonLink = {
  rel: 'self' | 'first' | 'prev' | 'next' | 'last' | 'profile' | 'employee';
  href: string;
};
