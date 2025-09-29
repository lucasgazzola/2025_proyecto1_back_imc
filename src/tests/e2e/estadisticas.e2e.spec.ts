import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('EstadisticasController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Crear usuario de prueba si no existe y loguear
    const email = 'testuser@email.com';
    const password = 'testpassword';

    // Intentar registrar usuario (ignorar error si ya existe)
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .catch(() => {});

    // Login y obtener token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });
    token = loginRes.body.access_token;
  });

  it('/api/estadisticas/summary (GET) debe devolver formato correcto', async () => {
    const res = await request(app.getHttpServer())
      .get('/estadisticas/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('promedioImc');
    expect(res.body).toHaveProperty('variacionPeso');
    expect(res.body).toHaveProperty('conteoCategorias');
    expect(Array.isArray(res.body.conteoCategorias)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
