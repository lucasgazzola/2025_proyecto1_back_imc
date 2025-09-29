import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticasController } from '../../module/estadisticas/estadisticas.controller';
import { EstadisticasService } from '../../module/estadisticas/estadisticas.service';
import { JwtAuthGuard } from '../../module/auth/jwt-auth.guard';
import { EstadisticasSummaryDto } from '../../module/estadisticas/dto/estadisticas-summary.dto';

import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { CategoriaCountDto } from '../../module/estadisticas/dto/estadisticas-summary.dto';

describe('EstadisticasController', () => {
  let controller: EstadisticasController;
  let service: EstadisticasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadisticasController],
      providers: [
        {
          provide: EstadisticasService,
          useValue: {
            getSummaryByEmail: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EstadisticasController>(EstadisticasController);
    service = module.get<EstadisticasService>(EstadisticasService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería devolver el summary correctamente', async () => {
    const summary: EstadisticasSummaryDto = {
      promedioImc: 22.5,
      variacionPeso: 5,
      conteoCategorias: [
        { categoria: 'Normal', count: 2 },
        { categoria: 'Obesidad', count: 1 },
      ],
    };
    (service.getSummaryByEmail as jest.Mock).mockResolvedValue(summary);
    const req = { user: { email: 'test@email.com' } };
    const res = await controller.getSummary(req as any);
    expect(service.getSummaryByEmail).toHaveBeenCalledWith(
      'test@email.com',
      undefined,
    );
    expect(res).toEqual(summary);
  });

  it('debería devolver respuesta vacía si no hay email', async () => {
    const req = { user: {} };
    const res = await controller.getSummary(req as any);
    expect(res).toEqual({
      promedioImc: null,
      variacionPeso: null,
      conteoCategorias: [],
    });
  });

  describe('Validación de DTOs', () => {
    it('debería validar EstadisticasSummaryDto correctamente', async () => {
      const dto: EstadisticasSummaryDto = {
        promedioImc: 22.5,
        variacionPeso: 5,
        conteoCategorias: [
          { categoria: 'Normal', count: 2 },
          { categoria: 'Obesidad', count: 1 },
        ],
      };
      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: EstadisticasSummaryDto,
        }),
      ).resolves.toEqual(dto);
    });

    it('debería validar CategoriaCountDto correctamente', async () => {
      const dto: CategoriaCountDto = { categoria: 'Normal', count: 2 };
      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: CategoriaCountDto,
        }),
      ).resolves.toEqual(dto);
    });

    it('debería lanzar BadRequestException si CategoriaCountDto es inválido', async () => {
      const invalidDto: CategoriaCountDto = {
        categoria: 123 as any,
        count: 'no-numero' as any,
      };
      const validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'body',
          metatype: CategoriaCountDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
