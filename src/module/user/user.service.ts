import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Historial } from '../historial/historial.entity';
import { Calculo } from '../historial/calculo.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
    @InjectRepository(Calculo)
    private readonly calculoRepository: Repository<Calculo>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['historial', 'historial.calculos'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['historial', 'historial.calculos'],
    });
  }

  async create(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    const historial = this.historialRepository.create({ calculos: [], user });
    await this.historialRepository.save(historial);
    user.historial = historial;
    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      historial: user.historial,
    };
  }

  async addHistory(
    email: string,
    entry: {
      peso: number;
      altura: number;
      imc: number;
      resultado: string;
    },
  ): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user || !user.historial)
      throw new Error('User or historial not found');
    const calculo = this.calculoRepository.create({
      ...entry,
      fecha: new Date(),
      historial: user.historial,
    });

    await this.calculoRepository.save(calculo);

    const userHistorial = await this.historialRepository.findOne({
      where: { id: user.historial.id },
      relations: ['calculos'],
    });
    if (userHistorial) {
      userHistorial.calculos.push(calculo);
      await this.historialRepository.save(userHistorial);
    }
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['historial', 'historial.calculos'],
    });
  }

  async getHistory(userId: number): Promise<Calculo[]> {
    const user = await this.findById(userId);
    if (!user || !user.historial) return [];
    return user.historial.calculos;
  }
}
