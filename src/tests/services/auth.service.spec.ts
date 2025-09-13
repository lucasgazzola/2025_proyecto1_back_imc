import { AuthService } from '../../module/auth/auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let jwtService: any;

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };
    authService = new AuthService(userService, jwtService);
  });

  it('debería validar usuario correctamente', async () => {
    userService.findByEmail.mockResolvedValue({
      email: 'a',
      password: await bcrypt.hash('b', 10),
    });
    const user = await authService.validateUser('a', 'b');
    expect(user.email).toBe('a');
  });

  it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
    userService.findByEmail.mockResolvedValue({
      email: 'a',
      password: await bcrypt.hash('b', 10),
    });
    await expect(authService.validateUser('a', 'x')).rejects.toThrow(
      'Credenciales inválidas',
    );
  });

  it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
    userService.findByEmail.mockResolvedValue(null);
    await expect(authService.validateUser('a', 'b')).rejects.toThrow(
      'Credenciales inválidas',
    );
  });

  it('debería registrar usuario correctamente', async () => {
    userService.findByEmail.mockResolvedValue(null);
    userService.create.mockResolvedValue({
      id: 1,
      email: 'nuevo',
      password: '123',
    });
    jwtService.sign.mockReturnValue('token123');
    const res = await authService.register('nuevo', '123');
    expect(res.access_token).toBe('token123');
  });

  it('debería lanzar UnauthorizedException si el usuario ya existe al registrar', async () => {
    userService.findByEmail.mockResolvedValue({ email: 'a', password: 'b' });
    await expect(authService.register('a', 'b')).rejects.toThrow(
      'El usuario ya existe',
    );
  });

  it('debería devolver access_token al hacer login', async () => {
    userService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'a',
      password: await bcrypt.hash('b', 10),
    });
    jwtService.sign.mockReturnValue('token123');
    const res = await authService.login('a', 'b');
    expect(res.access_token).toBe('token123');
  });
});
