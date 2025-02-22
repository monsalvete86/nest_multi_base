import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

type Tokens = {
  access_token: string,
  refresh_token: string
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model <UserDocument>,
    private jwtSvc: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword
      });

      const user: User = await newUser.save();
      const { access_token, refresh_token } = await this.generateTokens(user);

      return {
        access_token,
        refresh_token,
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        user: this.removePassword(user)
      }
    } catch (error) {
      console.log(error.message)
      throw new HttpException('Internal sever error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async login(createUserDto: Partial<CreateUserDto>) {
    const { email, password }  = createUserDto;
    try {
      const user = await this.userModel.findOne({ email }).exec();
      const isValidPass = await bcrypt.compare(password, user?.password);

      if (user && isValidPass) {
        const payload = {
          sub: user._id,
          email: user.email,
          name: user.name,
          role: user?.role
        };
        const { access_token, refresh_token } =
          await this.generateTokens(payload);

        return {
          access_token,
          message: 'Login Successful',
          refresh_token,
          user: this.removePassword(user)
        }
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = this.jwtSvc.verify(refreshToken, { secret: 'jwt_secret_refresh' });
      const payload = { sub: user._id, email: user.email, name: user.name };
      const { access_token, refresh_token } = await this.generateTokens(payload);

      return {
        access_token,
        refresh_token,
        status: 200,
        message: 'Refresh token successfully'
      }
    } catch (error) {
      throw new HttpException('Refresh token failed', HttpStatus.UNAUTHORIZED);
    }

  }

  private async generateTokens(user): Promise<Tokens> {
    const jwtPayload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user?.role
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtSvc.signAsync(jwtPayload, {
        secret: 'jwt_secret',
        expiresIn: '1d'
      }),
      this.jwtSvc.signAsync(jwtPayload, {
        secret: 'jwt_secret_refresh',
        expiresIn: '1d'
      })
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  private removePassword(user) {
    const { password, ...rest } = user.toObject();
    return rest;
  }
}
