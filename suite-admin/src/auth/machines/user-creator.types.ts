import { CreateUserDto } from '../dtos/create-admin.dto';
import { Admin, AdminDocument } from '../../user/schemas/admin.schema';

export interface UserCreatorContext {
  dto?: CreateUserDto;
  user?: Admin;
  token?: string;
  error?: any;
  status?: any;
}

export type UserCreatorServiceSchema = {
  createUser: {
    data: {
      user: AdminDocument;
      token: string;
    };
  };
};
