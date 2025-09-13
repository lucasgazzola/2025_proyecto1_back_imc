import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getHistorialByUserEmail(@Request() req) {
    const { email } = req.user;
    const historial = await this.historialService.getByUserEmail(email);
    if (!historial) return null;
    return await this.historialService.getCalculos(historial.id);
  }
}
