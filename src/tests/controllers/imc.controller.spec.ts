import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from '../../module/imc/imc.controller';
import { ImcService } from '../../module/imc/imc.service';
import { CalcularImcDto } from '../../module/imc/dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../module/auth/jwt-auth.guard';

describe('ImcController', () => {
  let controller: ImcController;
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [
        {
          provide: ImcService,
          useValue: {
            calcularImc: jest.fn(),
          },
        },
        {
          provide: require('../../module/user/user.service').UserService,
          useValue: {
            addHistory: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería calcular el IMC y devolver el resultado', async () => {
    const dto: CalcularImcDto = { peso: 70, altura: 1.75 };
    const resultado = { imc: 22.86, categoria: 'Normal' };
    (service.calcularImc as jest.Mock).mockResolvedValue(resultado);
    const addHistoryMock = jest.fn();
    controller['userService'].addHistory = addHistoryMock;
    const req = { user: { email: 'test@example.com' } };
    const res = await controller.calcular(dto, req as any);
    expect(service.calcularImc).toHaveBeenCalledWith(dto);
    expect(addHistoryMock).toHaveBeenCalledWith('test@example.com', {
      peso: dto.peso,
      altura: dto.altura,
      imc: resultado.imc,
      resultado: resultado.categoria,
    });
    expect(res).toEqual(resultado);
  });

  it('debería lanzar BadRequestException si los datos son inválidos', async () => {
    const invalidDto: CalcularImcDto = { peso: -10, altura: 0 };
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería propagar errores del servicio', async () => {
    const dto: CalcularImcDto = { peso: 70, altura: 1.75 };
    (service.calcularImc as jest.Mock).mockRejectedValue(
      new Error('Error de cálculo'),
    );
    const req = { user: { email: 'test@example.com' } };
    await expect(controller.calcular(dto, req as any)).rejects.toThrow(
      'Error de cálculo',
    );
  });

  it('debería propagar errores de addHistory', async () => {
    const dto: CalcularImcDto = { peso: 70, altura: 1.75 };
    const resultado = { imc: 22.86, categoria: 'Normal' };
    (service.calcularImc as jest.Mock).mockResolvedValue(resultado);
    const addHistoryMock = jest
      .fn()
      .mockRejectedValue(new Error('Error al guardar historial'));
    controller['userService'].addHistory = addHistoryMock;
    const req = { user: { email: 'test@example.com' } };
    await expect(controller.calcular(dto, req as any)).rejects.toThrow(
      'Error al guardar historial',
    );
  });

  it('debería calcular el IMC con datos límite válidos', async () => {
    const dto: CalcularImcDto = { peso: 500, altura: 3 };
    const resultado = { imc: 55.55, categoria: 'Obeso' };
    (service.calcularImc as jest.Mock).mockResolvedValue(resultado);
    const addHistoryMock = jest.fn();
    controller['userService'].addHistory = addHistoryMock;
    const req = { user: { email: 'test@example.com' } };
    const res = await controller.calcular(dto, req as any);
    expect(service.calcularImc).toHaveBeenCalledWith(dto);
    expect(addHistoryMock).toHaveBeenCalledWith('test@example.com', {
      peso: dto.peso,
      altura: dto.altura,
      imc: resultado.imc,
      resultado: resultado.categoria,
    });
    expect(res).toEqual(resultado);
  });
});
