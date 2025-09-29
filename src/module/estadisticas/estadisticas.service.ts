import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calculo } from '../historial/calculo.entity';
import { EstadisticaStrategy } from './strategy/estadistica-strategy.interface';
import { MediaStrategy } from './strategy/media.strategy';
import { MedianaStrategy } from './strategy/mediana.strategy';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Calculo)
    private readonly calculoRepository: Repository<Calculo>,
  ) {}

  async getSummaryByEmail(email: string, estrategia: string = 'media') {
    // Obtener todos los IMC del usuario
    const calculos = await this.calculoRepository
      .createQueryBuilder('calculo')
      .select([
        'calculo.imc',
        'calculo.peso',
        'calculo.fecha',
        'calculo.resultado',
      ])
      .innerJoin('calculo.historial', 'historial')
      .innerJoin('historial.user', 'user')
      .where('user.email = :email', { email })
      .orderBy('calculo.fecha', 'ASC')
      .getMany();

    // Selección de estrategia
    let strategy: EstadisticaStrategy;
    switch (estrategia) {
      case 'mediana':
        strategy = new MedianaStrategy();
        break;
      case 'media':
      default:
        strategy = new MediaStrategy();
        break;
    }

    // Calcular promedio/mediana de IMC
    const imcs = calculos.map((c) => c.imc);
    let promedioImc: number | null = null;
    if (imcs.length) {
      const calculado = strategy.calcular(imcs);
      promedioImc = isNaN(calculado) ? null : Math.round(calculado * 100) / 100;
    }

    // Variación de peso (último - primero)
    let variacionPeso: number | null = null;
    if (calculos.length > 1) {
      variacionPeso = calculos[calculos.length - 1].peso - calculos[0].peso;
    }

    // Conteo por categoría (resultado)
    const conteoCategorias: { categoria: string; count: number }[] = [];
    const categoriasMap = new Map<string, number>();
    calculos.forEach((c) => {
      categoriasMap.set(c.resultado, (categoriasMap.get(c.resultado) || 0) + 1);
    });
    categoriasMap.forEach((count, categoria) => {
      conteoCategorias.push({ categoria, count });
    });

    return {
      promedioImc,
      variacionPeso,
      conteoCategorias,
    };
  }
}
