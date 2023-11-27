import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Username already exists.',
    type: CreateUserDto,
  })
  // @ApiBody({
  //   description: 'User data to create a new user',
  //   type: CreateUserDto,
  //   examples: {
  //     'application/json': {
  //       username: 'john_doe',
  //       password: 'password123',
  //     },
  //   },
  // })
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new Error('Username already exists');
    }

    return this.userService.createUser(
      createUserDto.username,
      createUserDto.password,
    );
  }
}
