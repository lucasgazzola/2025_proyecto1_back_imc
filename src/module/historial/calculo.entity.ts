import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Historial } from './historial.entity';

@Entity()
export class Calculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column('float')
  peso: number;

  @Column('float')
  altura: number;

  @Column('float')
  imc: number;

  @Column()
  resultado: string;

  @ManyToOne(() => Historial, (historial) => historial.calculos)
  historial: Historial;
}
