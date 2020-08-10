import { database } from '../../../../database';
import { User } from '../../../../Models/User';

const getAutoSuggestUsers = (limit = 10, substring = ''): User[] => {
  if (limit <= 0) {
    return [];
  }
  const sortedUsers = database.users.sortBy('login');

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
