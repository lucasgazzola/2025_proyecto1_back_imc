import { Test, TestingModule } from '@nestjs/testing';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';

describe('ImcService', () => {
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImcService],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate IMC correctly', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(22.86, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Normal');
  });

  it('should return Bajo peso for IMC < 18.5', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Obeso for IMC >= 30', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obeso');
  });

  it('should throw error for very high weight (> 500 kg)', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 510 };
    expect(() => service.calcularImc(dto)).toThrow(
      'El peso no puede ser mayor a 500 kg',
    );
  });

  it('should throw error for very tall height (> 3 meters)', () => {
    const dto: CalcularImcDto = { altura: 3.1, peso: 100 };
    expect(() => service.calcularImc(dto)).toThrow(
      'La altura no puede ser mayor a 3 metros',
    );
  });
});
