import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';

@Injectable()
export class ImcService {
  calcularImc(data: CalcularImcDto): { imc: number; categoria: string } {
    const { altura, peso } = data;

    // Validaciones explícitas para nulos, undefined y tipo
    if (
      peso === null ||
      peso === undefined ||
      typeof peso !== 'number' ||
      isNaN(peso)
    ) {
      throw new BadRequestException('El peso debe ser un número válido');
    }
    if (
      altura === null ||
      altura === undefined ||
      typeof altura !== 'number' ||
      isNaN(altura)
    ) {
      throw new BadRequestException('La altura debe ser un número válido');
    }

    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Dos decimales

    if (altura < 0) {
      throw new BadRequestException(
        'La altura debe ser un número positivo distinto de cero',
      );
    }
    if (peso < 0) {
      throw new BadRequestException(
        'El peso debe ser un número positivo distinto de cero',
      );
    }
    if (peso > 500) {
      throw new BadRequestException('El peso no puede ser mayor a 500 kg');
    }
    if (altura > 3) {
      throw new BadRequestException('La altura no puede ser mayor a 3 metros');
    }

    let categoria: string;
    if (imc < 18.5) {
      categoria = 'Bajo peso';
    } else if (imc < 25) {
      categoria = 'Normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obeso';
    }

    return { imc: imcRedondeado, categoria };
  }
}
