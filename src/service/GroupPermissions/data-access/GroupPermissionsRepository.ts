import { BaseRepository } from '../../BaseRepository';
import { GroupPermission } from '../GroupPermission';
import { ICreateGroupPermission, IUpdateGroupPermission } from '../types';
import { GroupPermissionModel } from './GroupPermissionsModel';

export class GroupPermissionsRepository extends BaseRepository<
  GroupPermissionModel
> {
  private model: typeof GroupPermissionModel;

  constructor(model: typeof GroupPermissionModel) {
    super();
    this.model = model;
  }

  public async findById(
    id: string,
    isDeleted = false
  ): Promise<GroupPermissionModel | null> {
    this.validateId(id);
    const permission = await this.model.findOne({
      where: { uuid: id, isDeleted },
    });
    if (permission === null) {
      this.throwError('GroupPermission not found');
    }
    return permission;
  }
  async create(data: ICreateGroupPermission): Promise<GroupPermissionModel> {
    const newGroupPermission = new GroupPermission(data.name);
    const createdGroupPermission = await this.model.create(
      newGroupPermission.json
    );
    return createdGroupPermission;
  }
  update(
    id: string,
    data: IUpdateGroupPermission
  ): Promise<GroupPermissionModel> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
