import { IsNumber, IsNotEmpty, Max, Min } from 'class-validator';

export class CalcularImcDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1) // Altura mínima razonable
  @Max(3) // Altura máxima razonable
  altura: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1) // Peso mínimo razonable
  @Max(500) // Peso máximo razonable
  peso: number;
}
