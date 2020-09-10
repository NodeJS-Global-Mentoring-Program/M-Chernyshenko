import { initUserModel } from '../../service/Users/data-access/SequelizeUserModel';

export const initModels = (): void => {
  initUserModel();
};
