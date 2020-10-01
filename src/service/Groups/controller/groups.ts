import { ApiMiddleware, Sort } from '../../types';
import { ApiResponse } from '../../utils/ApiResponse';
import { GroupMapper } from '../api/GroupMapper';
import { GroupRepository } from '../api/GroupRepository';
import { GroupModel } from '../data-access';
import { IUpdateGroupData } from '../types';
import { GroupPermissionsRepository } from '../../GroupPermissions/data-access/GroupPermissionsRepository';
import { Response } from 'express';
import { UserModel, UserRepository } from '../../Users/data-access';
import { GroupPermissionModel } from '../../GroupPermissions/data-access';
import { ApiError } from '../../utils/ApiError';

type PatchGroupRequestBody = {
  id: string;
  permissions?: string[];
  users?: string[];
} & IUpdateGroupData;

type PostGroupRequestBody = {
  permissions?: string[];
  users?: string[];
} & Required<IUpdateGroupData>;

interface GetGroupsRequestQuery {
  name?: string;
  isDeleted?: number;
  sort?: Sort;
  limit?: number;
  offset?: number;
}

const groupRepository = new GroupRepository(GroupModel);
const groupPermissionsRepository = new GroupPermissionsRepository(
  GroupPermissionModel
);
const useRepository = new UserRepository(UserModel);
const groupMapper = new GroupMapper();

async function checkPermissionExisting(
  permissions: string[],
  res: Response
): Promise<boolean> {
  if (permissions.length === 0) {
    return true;
  }
  const searchPermissionsResult = await Promise.all(
    permissions.map((perm) => groupPermissionsRepository.findById(perm))
  );
  const notFoundedPermissions = searchPermissionsResult.filter(
    (permResult) => permResult && !permissions.includes(permResult.uuid)
  );
  if (notFoundedPermissions.length > 0) {
    res.status(400).json(
      new ApiResponse({
        errors: notFoundedPermissions.map(
          (perm) => `permission with id ${perm} not found`
        ),
      })
    );
    return false;
  }
  return true;
}

const checkUsersExist = async (
  ids: string[],
  res: Response
): Promise<boolean> => {
  if (ids.length === 0) {
    return true;
  }
  const searchUsersResult = await Promise.all(
    ids.map((id) => useRepository.findById(id))
  );
  const notFoundedUsers = searchUsersResult.filter(
    (userResult) => userResult && !ids.includes(userResult.uuid)
  );
  if (notFoundedUsers.length > 0) {
    res.status(400).json(
      new ApiResponse({
        errors: notFoundedUsers.map((user) => `user with id ${user} not found`),
      })
    );
    return false;
  }
  return true;
};

export const getGroup: ApiMiddleware<any, any, { id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  const group = await groupRepository.findById(id);
  if (group === null) {
    res.json(new ApiResponse({ errors: [new Error('group not found')] }));
  } else {
    res.json(new ApiResponse({ data: { group: groupMapper.toDto(group) } }));
  }
};

export const getGroups: ApiMiddleware<any, GetGroupsRequestQuery> = async (
  req,
  res,
  next
) => {
  const { isDeleted, limit, name, offset, sort } = req.query;
  const groups = await groupRepository.findAll(
    { name, isDeleted: isDeleted === 1 },
    { limit, offset, sort }
  );
  const groupsWithData = await Promise.all(
    groups.map(async (group) => {
      const permissions = await group.getPermissions();
      const users = await group.getUsers();
      return {
        ...group,
        permissions,
        users,
      };
    })
  );

  res.json(
    new ApiResponse({
      data: { groups: groups.map((group) => groupMapper.toDto(group)) },
    })
  );
};

export const createGroup: ApiMiddleware<PostGroupRequestBody> = async (
  req,
  res,
  next
) => {
  const { name, permissions = [], users = [] } = req.body;
  const isAllPermissionExist = await checkPermissionExisting(permissions, res);
  const isAllUsersExist = await checkUsersExist(users, res);
  const isGroupExist = await groupRepository.isGroupExist(name);
  if (isGroupExist) {
    return next(new ApiError({ code: 400, message: 'group already exist' }));
  }
  if (!isAllPermissionExist) {
    return next(new ApiError({ code: 400, message: 'permissions not found' }));
  }
  if (!isAllUsersExist) {
    return next(new ApiError({ code: 400, message: 'users not found' }));
  }
  const group = await groupRepository.create({ name });
  if (users.length > 0 && isAllUsersExist === true) {
    await group.addUsers(users);
  }
  if (permissions.length > 0 && isAllPermissionExist === true) {
    await group.addPermissions(permissions);
  }
  res.json(new ApiResponse({ data: { group: groupMapper.toDto(group) } }));
};

export const patchGroup: ApiMiddleware<PatchGroupRequestBody> = async (
  req,
  res,
  next
) => {
  const { id, name, permissions = [], users = [] } = req.body;
  const isAllPermissionExist = await checkPermissionExisting(permissions, res);
  const isAllUsersExist = await checkUsersExist(users, res);
  if (!isAllPermissionExist || !isAllUsersExist) {
    return;
  }
  const group = await groupRepository.update(id, { name });
  await group.addUsers(users);
  await group.addPermissions(permissions);
  res.json(
    new ApiResponse({ data: { group: { ...groupMapper.toDto(group) } } })
  );
};

export const deleteGroup: ApiMiddleware<
  unknown,
  unknown,
  { id: string }
> = async (req, res, next) => {
  const { id } = req.params;
  const groupId = await groupRepository.delete(id);
  res.json(new ApiResponse({ data: { id: groupId } }));
};
