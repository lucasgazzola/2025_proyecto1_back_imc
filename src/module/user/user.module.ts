import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HistorialModule } from '../historial/historial.module';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Historial } from '../historial/historial.entity';
import { Calculo } from '../historial/calculo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Historial, Calculo]),
    forwardRef(() => AuthModule),
    HistorialModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
