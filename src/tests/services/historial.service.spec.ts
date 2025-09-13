import { Test, TestingModule } from '@nestjs/testing';
import { HistorialService } from '../../module/historial/historial.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Historial } from '../../module/historial/historial.entity';
import { Calculo } from '../../module/historial/calculo.entity';

describe('HistorialService', () => {
  let service: HistorialService;
  let historialRepo: any;
  let calculoRepo: any;

  beforeEach(async () => {
    historialRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    calculoRepo = { create: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistorialService,
        { provide: getRepositoryToken(Historial), useValue: historialRepo },
        { provide: getRepositoryToken(Calculo), useValue: calculoRepo },
      ],
    }).compile();
    service = module.get<HistorialService>(HistorialService);
  });

  it('debería devolver historial por id', async () => {
    historialRepo.findOne.mockResolvedValue({ id: 1, calculos: [] });
    const result = await service.getById(1);
    expect(result).toBeDefined();
    expect(result?.id).toBe(1);
  });

  it('debería agregar cálculo al historial', async () => {
    historialRepo.findOne.mockResolvedValue({ id: 1, calculos: [] });
    calculoRepo.create.mockReturnValue({ peso: 70, altura: 175 });
    calculoRepo.save.mockResolvedValue({ id: 2, peso: 70, altura: 175 });
    const result = await service.addCalculo(1, { peso: 70, altura: 175 });
    expect(result).toBeDefined();
    expect(result?.peso).toBe(70);
  });

  it('debería lanzar error si el historial no existe', async () => {
    historialRepo.findOne.mockResolvedValue(null);
    await expect(service.getById(999)).rejects.toThrow();
  });

  it('debería lanzar error al agregar cálculo con datos inválidos', async () => {
    historialRepo.findOne.mockResolvedValue({ id: 1, calculos: [] });
    calculoRepo.create.mockReturnValue({ peso: null, altura: null });
    calculoRepo.save.mockResolvedValue({ id: 2, peso: null, altura: null });
    await expect(service.addCalculo(1, {})).rejects.toThrow();
  });

  it('debería lanzar error si el repositorio falla al guardar', async () => {
    historialRepo.findOne.mockResolvedValue({ id: 1, calculos: [] });
    calculoRepo.create.mockReturnValue({ peso: 70, altura: 175 });
    calculoRepo.save.mockRejectedValue(new Error('Error de base de datos'));
    await expect(
      service.addCalculo(1, { peso: 70, altura: 175 }),
    ).rejects.toThrow('Error de base de datos');
  });
});
