import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { Calculo } from './calculo.entity';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Historial, Calculo]),
    forwardRef(() => AuthModule),
  ],
  providers: [HistorialService],
  controllers: [HistorialController],
  exports: [HistorialService],
})
export class HistorialModule {}
