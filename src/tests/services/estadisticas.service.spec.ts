import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticasService } from '../../module/estadisticas/estadisticas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Calculo } from '../../module/historial/calculo.entity';

describe('EstadisticasService', () => {
  let service: EstadisticasService;
  let calculoRepo: any;

  beforeEach(async () => {
    calculoRepo = {
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawOne: jest
          .fn()
          .mockResolvedValue({ promedioImc: 18.08333333333333 }),
        getMany: jest.fn().mockResolvedValue([
          {
            imc: 17,
            peso: 68,
            fecha: new Date('2025-09-28T21:03:40.000Z'),
            resultado: 'Bajo peso',
          },
          {
            imc: 17.5,
            peso: 70,
            fecha: new Date('2025-09-28T21:03:52.000Z'),
            resultado: 'Bajo peso',
          },
          {
            imc: 19.75,
            peso: 79,
            fecha: new Date('2025-09-28T21:03:59.000Z'),
            resultado: 'Normal',
          },
        ]),
        getRawMany: jest.fn().mockResolvedValue([
          { categoria: 'Bajo peso', count: '2' },
          { categoria: 'Normal', count: '1' },
        ]),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstadisticasService,
        { provide: getRepositoryToken(Calculo), useValue: calculoRepo },
      ],
    }).compile();
    service = module.get<EstadisticasService>(EstadisticasService);
  });

  it('debe devolver el summary correctamente con redondeo y count numérico', async () => {
    const result = await service.getSummaryByEmail('test@email.com');
    expect(result.promedioImc).toBeCloseTo(18.08, 2);
    expect(result.variacionPeso).toBe(11);
    expect(result.conteoCategorias).toEqual([
      { categoria: 'Bajo peso', count: 2 },
      { categoria: 'Normal', count: 1 },
    ]);
  });
});
