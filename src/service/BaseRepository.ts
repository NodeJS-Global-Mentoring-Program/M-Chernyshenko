import { Model } from 'sequelize';
import { validate } from 'uuid';

export abstract class BaseRepository<DataModel extends Model> {
  abstract findById(id: string, isDeleted?: boolean): Promise<DataModel | null>;
  abstract create(data: DataModel): Promise<DataModel>;
  abstract update(id: string, data: Partial<DataModel>): Promise<DataModel>;
  abstract delete(id: string): Promise<string>;

  protected throwError(err: string): never {
    throw new Error(err);
  }

  protected validateId(id: any): void {
    if (typeof id !== 'string' || !validate(id)) {
      this.throwError(`id ${id} is not valid`);
    }
  }
}
