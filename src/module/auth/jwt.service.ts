import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecretkey'; // Cambia esto en producción
const JWT_EXPIRES_IN = '1h';

@Injectable()
export class JwtService {
  sign(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verify(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
}
