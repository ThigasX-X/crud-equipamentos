import { IsEnum, IsOptional } from 'class-validator';
import { EquipmentStatus, EquipmentType } from '../entities/equipment.entity';

export class FilterEquipmentDto {
  @IsOptional()
  @IsEnum(EquipmentType)
  type?: EquipmentType;

  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;
}
