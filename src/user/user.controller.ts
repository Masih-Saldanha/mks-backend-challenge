import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiCreatedResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username already exists.',
    type: UserDto,
  })
  @ApiBody({ type: UserDto })
  async create(@Body() userInfo: UserDto) {
    return this.userService.createUser(userInfo.username, userInfo.password);
  }

  @Post('signin')
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UserDto })
  async login(@Body() userInfo: UserDto): Promise<{ token: string }> {
    const token = await this.userService.validateUser(
      userInfo.username,
      userInfo.password,
    );

    return { token };
  }
}
