import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './historial.entity';
import { Calculo } from './calculo.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
    @InjectRepository(Calculo)
    private readonly calculoRepository: Repository<Calculo>,
  ) {}

  async getById(id: number): Promise<Historial | null> {
    return this.historialRepository.findOne({
      where: { id },
      relations: ['calculos'],
    });
  }

  async getByUserEmail(email: string): Promise<Historial | null> {
    return this.historialRepository.findOne({
      where: { user: { email } },
      relations: ['user', 'calculos'],
    });
  }

  async addCalculo(
    historialId: number,
    entry: Partial<Calculo>,
  ): Promise<Calculo | null> {
    const historial = await this.getById(historialId);
    if (!historial) throw new Error('Historial not found');
    const calculo = this.calculoRepository.create({ ...entry, historial });
    return this.calculoRepository.save(calculo);
  }

  async getCalculos(historialId: number): Promise<Calculo[]> {
    const historial = await this.getById(historialId);
    return historial?.calculos ?? [];
  }
}
