import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('debería estar definido', () => {
    expect(module).toBeDefined();
  });
});
