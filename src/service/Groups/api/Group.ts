import { v4 } from 'uuid';
import { GroupDto, ICreateGroupData } from '../types';

export class Group {
  private _name;
  private _isDeleted = false;
  private uuid = v4();

  constructor({ name }: ICreateGroupData) {
    this._name = name;
  }

  public get json(): GroupDto {
    return {
      uuid: this.uuid,
      isDeleted: this._isDeleted,
      name: this._name,
    };
  }
}
