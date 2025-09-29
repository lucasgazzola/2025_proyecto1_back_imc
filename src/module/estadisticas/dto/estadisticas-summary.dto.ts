/**
 * DTO para la respuesta del endpoint /api/estadisticas/summary
 * - promedioImc: promedio de IMC del usuario (redondeado a 2 decimales)
 * - variacionPeso: diferencia entre el último y el primer peso
 * - conteoCategorias: cantidad de cálculos por cada categoría
 */
import { IsNumber, IsOptional, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class EstadisticasSummaryDto {
  @IsOptional()
  @IsNumber()
  promedioImc: number | null;

  @IsOptional()
  @IsNumber()
  variacionPeso: number | null;

  @IsArray()
  conteoCategorias: CategoriaCountDto[];
}

export class CategoriaCountDto {
  @IsString()
  categoria: string;

  @IsNumber()
  count: number;
}
