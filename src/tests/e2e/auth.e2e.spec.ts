import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('registers a new user', async () => {
    const uniqueEmail = `test${Date.now()}@correo.com`;
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: uniqueEmail, password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
  });

  it('does not allow duplicate registration', async () => {
    const email = 'test2@correo.com';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: '123456' });
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: '123456' });
    expect(res.status).toBe(409);
  });

  it('logs in a user', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test3@correo.com', password: '123456' });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test3@correo.com', password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test4@correo.com', password: '123456' });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test4@correo.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
