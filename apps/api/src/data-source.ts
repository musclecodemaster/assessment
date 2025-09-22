import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Task } from './entities/task.entity';
import { AuditLog } from './entities/audit-log.entity';

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_URL || './task-management.sqlite',
  entities: [User, Organization, Role, Permission, Task, AuditLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Set to false since we're using migrations
});