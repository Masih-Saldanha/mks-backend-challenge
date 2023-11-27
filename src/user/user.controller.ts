import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
    const existingUser = await this.userService.findByUsername(
      userInfo.username,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return this.userService.createUser(userInfo.username, userInfo.password);
  }

  @Post('signin')
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UserDto })
  async login(@Body() userInfo: UserDto) {
    const user = await this.userService.validateUser(
      userInfo.username,
      userInfo.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
