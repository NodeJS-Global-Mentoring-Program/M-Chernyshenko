export interface GroupPermissionDto {
  uuid: string;
  name: string;
  isDeleted: boolean;
}

export type ICreateGroupPermission = Pick<GroupPermissionDto, 'name'>;
export type IUpdateGroupPermission = ICreateGroupPermission;
