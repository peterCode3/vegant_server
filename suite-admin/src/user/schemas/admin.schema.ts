import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AdminToken } from './admin-token.schema';
import { Exclude } from 'class-transformer';
import { BaseModel } from '../../mongoose/base-model.schema';

export type AdminDocument = HydratedDocument<Admin>;

export enum AdminRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Schema({
  timestamps: true,
})
export class Admin extends BaseModel<Admin> {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  @Exclude()
  password: string;

  @Prop()
  @Exclude()
  tokens?: AdminToken[];

  @Prop({
    type: String,
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  role: AdminRole;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
