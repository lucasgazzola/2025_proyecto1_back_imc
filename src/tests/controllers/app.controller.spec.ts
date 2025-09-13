import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('raíz', () => {
    it('debería retornar "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('debería retornar un string', () => {
      const result = appController.getHello();
      expect(typeof result).toBe('string');
    });

    it('no debería retornar undefined', () => {
      const result = appController.getHello();
      expect(result).not.toBeUndefined();
    });
  });
});
