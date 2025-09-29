import { EstadisticaStrategy } from './estadistica-strategy.interface';

export class MedianaStrategy implements EstadisticaStrategy {
  calcular(valores: number[]): number {
    if (!valores.length) return 0;
    const ordenados = [...valores].sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);
    if (ordenados.length % 2 === 0) {
      return (ordenados[mitad - 1] + ordenados[mitad]) / 2;
    } else {
      return ordenados[mitad];
    }
  }
}
