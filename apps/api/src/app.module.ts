import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Task } from './entities/task.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_URL || 'task-management.sqlite',
      entities: [User, Organization, Role, Permission, Task, AuditLog],
      synchronize: true, // For dev only
    }),
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}