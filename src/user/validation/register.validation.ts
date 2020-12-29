import { UserService } from '../user.service';

interface Errors {
  email?: string;
  username?: string;
}

export const usernameOrEmailExists = async (
  username: string,
  email: string,
  userService: UserService,
  errors: Errors,
) => {
  const emailUsed = await userService.findByEmail(email);
  const usernameUsed = await userService.findByUsername(username);
  if (emailUsed) errors.email = 'Email is already taken';
  if (usernameUsed) errors.username = 'Username is already taken';
  return errors;
};
