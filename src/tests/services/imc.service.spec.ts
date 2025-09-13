import { Test, TestingModule } from '@nestjs/testing';
import { ImcService } from '../../module/imc/imc.service';
import { CalcularImcDto } from '../../module/imc/dto/calcular-imc-dto';

describe('ImcService', () => {
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImcService],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería calcular el IMC correctamente', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(22.86, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Normal');
  });

  it('debería retornar "Bajo peso" para IMC < 18.5', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('debería retornar "Sobrepeso" para 25 <= IMC < 30', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('debería retornar "Obeso" para IMC >= 30', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obeso');
  });

  it('debería lanzar error para peso muy alto (> 500 kg)', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 510 };
    expect(() => service.calcularImc(dto)).toThrow(
      'El peso no puede ser mayor a 500 kg',
    );
  });

  it('debería lanzar error para altura muy alta (> 3 metros)', () => {
    const dto: CalcularImcDto = { altura: 3.1, peso: 100 };
    expect(() => service.calcularImc(dto)).toThrow(
      'La altura no puede ser mayor a 3 metros',
    );
  });

  it('debería lanzar error si el peso es nulo', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: null as any };
    expect(() => service.calcularImc(dto)).toThrow();
  });

  it('debería lanzar error si la altura es nula', () => {
    const dto: CalcularImcDto = { altura: null as any, peso: 70 };
    expect(() => service.calcularImc(dto)).toThrow();
  });

  it('debería lanzar error si el peso es un string', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 'setenta' as any };
    expect(() => service.calcularImc(dto)).toThrow();
  });

  it('debería lanzar error si la altura es un string', () => {
    const dto: CalcularImcDto = { altura: 'uno setenta' as any, peso: 70 };
    expect(() => service.calcularImc(dto)).toThrow();
  });
});
