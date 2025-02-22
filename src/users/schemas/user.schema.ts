import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  readonly email: string;

  @Prop()
  readonly password: string;

  @Prop()
  readonly phone: string;
}

export const CatSchema = SchemaFactory.createForClass(User);
