import { Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';

@Injectable()
export class ImcService {
  calcularImc(data: CalcularImcDto): { imc: number; categoria: string } {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Dos decimales

    // Agregadas vaidaciones
    if (data.altura < 0) {
      throw new Error('La altura debe ser un número positivo distinto de cero');
    }
    if (data.peso < 0) {
      throw new Error('El peso debe ser un número positivo distinto de cero');
    }
    if (data.peso > 500) {
      throw new Error('El peso no puede ser mayor a 500 kg');
    }
    if (data.altura > 3) {
      throw new Error('La altura no puede ser mayor a 3 metros');
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
