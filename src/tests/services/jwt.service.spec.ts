import { JwtService } from '../../module/auth/jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    service = new JwtService();
  });

  it('debería firmar y verificar un payload correctamente', () => {
    const payload = { userId: 123, email: 'test@example.com' };
    const token = service.sign(payload);
    const decoded = service.verify(token);
    expect(decoded.userId).toBe(123);
    expect(decoded.email).toBe('test@example.com');
  });

  it('debería devolver null si el token es inválido', () => {
    const invalidToken = 'token_invalido';
    const result = service.verify(invalidToken);
    expect(result).toBeNull();
  });

  it('debería incluir la expiración en el token', () => {
    const payload = { userId: 1 };
    const token = service.sign(payload);
    const decoded = service.verify(token);
    expect(decoded.exp).toBeDefined();
  });
});
