import { AdminDocument } from '../../user/schemas/admin.schema';
import { LoginUserDto } from '../dtos/login-admin.dto';

export interface UserLoginContext {
  dto?: LoginUserDto;

  status?: number;

  error?: string;

  user?: AdminDocument;

  token?: string;
}

export type UserLoginServiceSchema = {
  findUserById: {
    data: {
      user?: AdminDocument;
      error?: string;
      status?: number;
    };
  };

  checkPassword: {
    data: void;
  };

  createToken: {
    data: {
      token: string;
    };
  };
};
