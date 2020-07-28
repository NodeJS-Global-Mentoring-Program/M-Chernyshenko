import { User } from '../../Models/User';
import { users } from '../../database';

const getAutoSuggestUsers = (limit = 10, substring = ''): User[] => {
  if (limit <= 0) {
    return [];
  }
  const sortedUsers = users
    .filter((user) => !user.isDeleted)
    .sort((prev, next) => {
      if (prev.login < next.login) {
        return -1;
      } else if (prev.login > next.login) {
        return 1;
      }
      return 0;
    });

  if (substring.length !== 0 && limit >= sortedUsers.length) {
    return sortedUsers.filter((user) =>
      user.login.toLowerCase().includes(substring)
    );
  } else if (substring.length === 0 && limit > 0) {
    return sortedUsers.slice(0, limit);
  } else if (limit > 0 && substring.length !== 0) {
    let count = 0;
    const selectedUsers: User[] = [];
    for (let i = 0; i < sortedUsers.length && count < limit; i++) {
      const user = sortedUsers[i];
      if (user.login.includes(substring)) {
        selectedUsers.push(user);
        count++;
      }
    }
    return selectedUsers;
  }

  return [];
};

export { getAutoSuggestUsers };
