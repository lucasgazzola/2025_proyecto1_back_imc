import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EstadisticasSummaryDto } from './dto/estadisticas-summary.dto';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('summary')
  async getSummary(
    @Request() req,
    @Query('estrategia') estrategia?: string,
  ): Promise<EstadisticasSummaryDto> {
    const email = req.user.email;
    if (!email)
      return { promedioImc: null, variacionPeso: null, conteoCategorias: [] };
    return await this.estadisticasService.getSummaryByEmail(email, estrategia);
  }
}
