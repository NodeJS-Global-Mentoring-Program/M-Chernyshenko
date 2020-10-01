export interface GroupDto {
  uuid: string;
  isDeleted: boolean;
  name: string;
}

export type IUpdateGroupData = Partial<Pick<GroupDto, 'name'>>;

export type ICreateGroupData = Pick<GroupDto, 'name'>;
