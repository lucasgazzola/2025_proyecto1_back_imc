import { Test, TestingModule } from '@nestjs/testing';
import { ImcModule } from './imc.module';

describe('ImcModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ImcModule],
    }).compile();
  });

  it('debería estar definido', () => {
    expect(module).toBeDefined();
  });
});
