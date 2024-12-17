import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class AdminToken {
  constructor(partial: Partial<AdminToken>) {
    Object.assign(this, partial);
  }

  @Prop({
    required: true,
  })
  jti: string;

  @Prop({
    required: true,
  })
  expires_at: Date;

  @Prop()
  revoked_at?: Date;

  @Prop()
  scopes?: string[];
}
