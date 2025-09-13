import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('IMC & Historial (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Registro y login para obtener token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'imc@correo.com', password: '123456' });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'imc@correo.com', password: '123456' });
    token = res.body.access_token;
  });

  it('calcula IMC y lo guarda en el historial', async () => {
    const res = await request(app.getHttpServer())
      .post('/imc/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send({ peso: 70, altura: 1.75 });
    expect(res.status).toBe(201);
    expect(res.body.imc).toBeDefined();
    expect(res.body.categoria).toBeDefined();
  });

  it('devuelve el historial solo del usuario logueado', async () => {
    // Realiza dos cálculos
    await request(app.getHttpServer())
      .post('/imc/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send({ peso: 80, altura: 180 });
    await request(app.getHttpServer())
      .post('/imc/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send({ peso: 60, altura: 160 });
    // Consulta historial
    const res = await request(app.getHttpServer())
      .get('/historial')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0].imc).toBeDefined();
    expect(res.body[0].resultado).toBeDefined();
  });

  it('no permite acceder al historial sin token', async () => {
    const res = await request(app.getHttpServer()).get('/historial');
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
