export enum EmployeeRole {
  manager = "manager",
  finalizer = "finalizer",
}

export type TEmployeeRole = keyof typeof EmployeeRole;
export type TEmployee = {
  staff_id: string;
  manager_id: string;
  roles: TEmployeeRole[];
  staff_manager_mapping: string;
  updatedAt: string;
  createdAt: string;
  org_id: string;
};
