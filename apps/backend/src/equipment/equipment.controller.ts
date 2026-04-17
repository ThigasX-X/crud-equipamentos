import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { FilterEquipmentDto } from './dto/filter-equipment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('equipments')
@UseGuards(JwtAuthGuard)
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEquipmentDto, @Req() req) {
    return this.equipmentService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() filters: FilterEquipmentDto, @Req() req) {
    return this.equipmentService.findAll(req.user.id, filters.type, filters.status);
  }

  @Get('export/csv')
  async exportCsv(@Query() filters: FilterEquipmentDto, @Req() req, @Res() res: Response) {
    const data = await this.equipmentService.exportAll(req.user.id, filters.type, filters.status);
    const fields = ['id', 'name', 'type', 'acquisitionDate', 'status', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="equipamentos.csv"');
    res.send(csv);
  }

  @Get('export/json')
  async exportJson(@Query() filters: FilterEquipmentDto, @Req() req, @Res() res: Response) {
    const data = await this.equipmentService.exportAll(req.user.id, filters.type, filters.status);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="equipamentos.json"');
    res.json(data);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.equipmentService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEquipmentDto, @Req() req) {
    return this.equipmentService.update(id, req.user.id, dto);
  }

  @Patch(':id')
  patch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEquipmentDto, @Req() req) {
    return this.equipmentService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.equipmentService.remove(id, req.user.id);
  }
}
