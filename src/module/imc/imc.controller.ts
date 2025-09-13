import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('imc')
export class ImcController {
  constructor(
    private readonly imcService: ImcService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('calcular')
  async calcular(@Body(ValidationPipe) data: CalcularImcDto, @Req() req) {
    const result = await this.imcService.calcularImc(data);

    const email = req.user.email;

    await this.userService.addHistory(email, {
      peso: data.peso,
      altura: data.altura,
      imc: result.imc,
      resultado: result.categoria,
    });
    return result;
  }
}
