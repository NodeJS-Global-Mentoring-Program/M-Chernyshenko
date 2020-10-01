import { Op } from 'sequelize';
import { BaseRepository } from '../../BaseRepository';
import { SORT_ORDER } from '../../constants';
import { Sort } from '../../types';
import { GroupDto, ICreateGroupData, IUpdateGroupData } from '../types';
import { GroupModel } from '../data-access';
import { Group } from './Group';

const groupNotFoundMessage = 'Group not found';

type FindAllData = Partial<Pick<GroupDto, 'isDeleted' | 'name'>>;
const defaultFindAllData: FindAllData = {
  isDeleted: false,
  name: '',
};
interface FindAllParams {
  limit?: number;
  offset?: number;
  sort?: Sort;
}
const defaultFindAllParams: FindAllParams = {
  limit: 10,
  offset: 0,
  sort: ['name', SORT_ORDER.ASC],
};

export class GroupRepository extends BaseRepository<GroupModel> {
  private GroupModel: typeof GroupModel;

  constructor(groupModel: typeof GroupModel) {
    super();
    this.GroupModel = groupModel;
  }
  async findById(id: string, isDeleted = false): Promise<GroupModel | null> {
    this.validateId(id);
    const group = await this.GroupModel.findOne({
      where: { uuid: id, isDeleted },
    });
    if (group === null) {
      return null;
    }
    return group;
  }

  public async isGroupExist(name: string): Promise<GroupModel | null> {
    return this.GroupModel.findOne({ where: { name } });
  }

  public async findAll(
    data = defaultFindAllData,
    params = defaultFindAllParams
  ): Promise<GroupModel[]> {
    const { isDeleted, name = '' } = data;
    const { limit, offset, sort } = params;
    // TODO доделать множественную сортировку
    const order = sort && [sort];
    const groups = await this.GroupModel.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        isDeleted,
      },
      limit,
      offset,
      order,
    });
    return groups;
  }

  public async create(data: ICreateGroupData): Promise<GroupModel> {
    const existingGroup = await this.GroupModel.findOne({
      where: { name: data.name },
    });
    if (existingGroup !== null) {
      this.throwError('Group already exist');
    }
    const group = new Group(data).json;
    const groupModel = await this.GroupModel.create(group);
    return groupModel;
  }

  public async update(id: string, data: IUpdateGroupData): Promise<GroupModel> {
    this.validateId(id);
    const group = await this.GroupModel.findOne({
      where: { uuid: id, isDeleted: false },
    });
    if (group === null) {
      this.throwError(groupNotFoundMessage);
    }
    const updatedGroup = await group.update({ ...data });
    return updatedGroup;
  }

  public async delete(id: string): Promise<string> {
    this.validateId(id);
    const group = await this.GroupModel.findOne({ where: { uuid: id } });
    if (group === null) {
      this.throwError(groupNotFoundMessage);
    }
    group.isDeleted = true;
    await group.save();
    return group.uuid;
  }
}
