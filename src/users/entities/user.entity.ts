import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true  })
  readonly email: string;

  @Prop({ required: true})
  readonly password: string;

  @Prop({ required: true })
  readonly phone: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
