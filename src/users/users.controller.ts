import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: Partial<CreateUserDto>) {
    return this.usersService.login(createUserDto);
  }

  @Post('refreshToken')
  async refreshToken(@Req() request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') || [];
    
    return this.usersService.refreshToken(token);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('get-by-email/:email')
  findOne(@Param('email') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
