import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { EquipmentStatus, EquipmentType } from '../entities/equipment.entity';

export class CreateEquipmentDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @IsEnum(EquipmentType, { message: 'Tipo deve ser MONITOR, CPU ou KEYBOARD' })
  type: EquipmentType;

  @IsNotEmpty({ message: 'Data de aquisição é obrigatória' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' })
  acquisitionDate: string;

  @IsEnum(EquipmentStatus, { message: 'Status deve ser ACTIVE ou MAINTENANCE' })
  status: EquipmentStatus;
}
