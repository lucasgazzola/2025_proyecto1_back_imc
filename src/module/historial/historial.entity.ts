import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Calculo } from './calculo.entity';
import { User } from '../user/user.entity';

@Entity()
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.historial)
  user: User;

  @OneToMany(() => Calculo, (calculo) => calculo.historial, { cascade: true })
  calculos: Calculo[];
}
