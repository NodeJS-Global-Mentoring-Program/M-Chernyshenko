import { v4 } from 'uuid';
import { GroupPermissionDto } from './types';

export class GroupPermission {
  private _isDeleted = false;
  private _uuid = v4();
  private _name;

  constructor(name: string) {
    this._name = name;
  }

  public get json(): GroupPermissionDto {
    return {
      isDeleted: this._isDeleted,
      name: this._name,
      uuid: this._uuid,
    };
  }
}
