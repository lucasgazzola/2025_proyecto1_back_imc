import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    await app.init();
  });

  it('debería responder con CORS headers', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
