import { Test, TestingModule } from '@nestjs/testing';
import { ImcModule } from '../../module/imc/imc.module';

describe('ImcModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ImcModule],
    })
      .overrideProvider('UserRepository')
      .useValue({})
      .overrideProvider('HistorialRepository')
      .useValue({})
      .overrideProvider('CalculoRepository')
      .useValue({})
      .overrideProvider('DataSource')
      .useValue({})
      .compile();
  });

  it('debería estar definido', () => {
    expect(module).toBeDefined();
  });
});
