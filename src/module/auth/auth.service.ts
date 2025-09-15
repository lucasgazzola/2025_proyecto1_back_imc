import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { JwtService } from './jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      // Usar ConflictException para usuario existente
      throw new ConflictException('El usuario ya existe');
    }
    const newUser = await this.userService.create(email, password);
    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
