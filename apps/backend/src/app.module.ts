import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentModule } from './equipment/equipment.module';
import { User } from './users/entities/user.entity';
import { Equipment } from './equipment/entities/equipment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'UNICEPLAC_EQUIPAMENTOS',
      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD,
      entities: [User, Equipment],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    EquipmentModule,
  ],
})
export class AppModule {}
