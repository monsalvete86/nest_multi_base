import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    /* JwtModule.register({
      global: true,
      secret: 'jwt secret',
      signOptions: { expiresIn: '60s' },
    }), */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
