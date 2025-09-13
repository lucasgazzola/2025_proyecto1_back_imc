import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    // TODO: Extraer saltRounds a una constante global o variable de entorno

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    // Crear historial y asociar al usuario
    const historial = this.historialRepository.create({ calculos: [], user });
    await this.historialRepository.save(historial);
    // Actualizar el usuario con el historial asociado
    await this.userRepository.update(user.id, { historial });
    // Recuperar el usuario actualizado con la relación
    const userWithHistorial = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['historial', 'historial.calculos'],
    });
    if (!userWithHistorial || !userWithHistorial.historial) {
      throw new ConflictException('Error al asociar historial al usuario');
    }
    return {
      id: userWithHistorial.id,
      email: userWithHistorial.email,
      historial: userWithHistorial.historial,
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
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!user.historial) {
      return [];
    }
    return user.historial.calculos;
  }
}
