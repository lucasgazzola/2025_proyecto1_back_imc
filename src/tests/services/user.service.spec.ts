import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../module/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../module/user/user.entity';
import { Historial } from '../../module/historial/historial.entity';
import { Calculo } from '../../module/historial/calculo.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepo: any;
  let historialRepo: any;
  let calculoRepo: any;

  beforeEach(async () => {
    userRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };
    historialRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
    calculoRepo = { create: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Historial), useValue: historialRepo },
        { provide: getRepositoryToken(Calculo), useValue: calculoRepo },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('debería crear usuario y historial', async () => {
    userRepo.create.mockReturnValue({
      email: 'email@valido.com',
      password: 'validpassword',
    });
    userRepo.save.mockResolvedValue({
      id: 1,
      email: 'email@valido.com',
      password: 'validpassword',
    });
    historialRepo.create.mockReturnValue({ calculos: [], user: { id: 1 } });
    historialRepo.save.mockResolvedValue({
      id: 2,
      calculos: [],
      user: { id: 1 },
    });
    userRepo.save.mockResolvedValue({
      id: 1,
      email: 'a',
      historial: { id: 2 },
    });
    // Mock para findOne tras la creación, retorna usuario con historial y calculos vacío
    userRepo.findOne.mockResolvedValue({
      id: 1,
      email: 'email@valido.com',
      historial: { id: 2, calculos: [], user: { id: 1 } },
    });
    const result = await service.create('email@valido.com', 'validpassword');
    expect(result.email).toBe('email@valido.com');
    expect(result.historial).toBeDefined();
  });

  it('debería devolver historial vacío si no existe', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, email: 'a', historial: null });
    const result = await service.getHistory(1);
    expect(result).toEqual([]);
  });

  it('debería lanzar error si el email es inválido al crear usuario', async () => {
    userRepo.create.mockReturnValue({ email: '', password: 'b' });
    userRepo.save.mockResolvedValue({ id: 1, email: '', password: 'b' });
    await expect(service.create('', 'b')).rejects.toThrow();
  });

  it('debería lanzar error si el usuario ya existe', async () => {
    userRepo.findOne.mockResolvedValue({ id: 1, email: 'a', password: 'b' });
    await expect(service.create('a', 'b')).rejects.toThrow();
  });

  it('debería lanzar error si se consulta historial de usuario inexistente', async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(service.getHistory(999)).rejects.toThrow();
  });
});
