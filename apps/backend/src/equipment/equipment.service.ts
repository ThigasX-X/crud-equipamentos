import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Equipment, EquipmentStatus, EquipmentType } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { FilterEquipmentDto } from './dto/filter-equipment.dto';

export interface PaginatedEquipment {
  data: Equipment[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async create(dto: CreateEquipmentDto, userId: string): Promise<Equipment> {
    const equipment = this.equipmentRepository.create({
      ...dto,
      user: { id: userId },
    });
    return this.equipmentRepository.save(equipment);
  }

  async findAll(userId: string, filters: FilterEquipmentDto): Promise<PaginatedEquipment> {
    const { type, status, page = 1, limit = 20 } = filters;
    const query = this.buildBaseQuery(userId, type, status);
    const total = await query.getCount();
    const data = await query
      .orderBy('equipment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    return { data, total, page, limit };
  }

  async findOne(id: string, userId: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipamento com ID "${id}" não encontrado`);
    }
    return equipment;
  }

  async update(id: string, userId: string, dto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findOne(id, userId);
    Object.assign(equipment, dto);
    return this.equipmentRepository.save(equipment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const equipment = await this.findOne(id, userId);
    await this.equipmentRepository.remove(equipment);
  }

  async exportAll(userId: string, type?: EquipmentType, status?: EquipmentStatus): Promise<Equipment[]> {
    return this.buildBaseQuery(userId, type, status)
      .orderBy('equipment.createdAt', 'DESC')
      .getMany();
  }

  private buildBaseQuery(
    userId: string,
    type?: EquipmentType,
    status?: EquipmentStatus,
  ): SelectQueryBuilder<Equipment> {
    const query = this.equipmentRepository
      .createQueryBuilder('equipment')
      .where('equipment.user_id = :userId', { userId });
    if (type) query.andWhere('equipment.type = :type', { type });
    if (status) query.andWhere('equipment.status = :status', { status });
    return query;
  }
}
