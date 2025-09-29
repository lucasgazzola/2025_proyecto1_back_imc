import { EstadisticaStrategy } from './estadistica-strategy.interface';

export class MediaStrategy implements EstadisticaStrategy {
  calcular(valores: number[]): number {
    if (!valores.length) return 0;
    const suma = valores.reduce((acc, val) => acc + val, 0);
    return suma / valores.length;
  }
}
