import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { Role } from '@task-management-system/data';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog) private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(userId: number, action: string) {
    const log = this.auditLogRepository.create({ userId, action, timestamp: new Date() });
    await this.auditLogRepository.save(log);
  }

  async findAll(user: any) {
    if (user.role === Role.Owner || user.role === Role.Admin) {
      return this.auditLogRepository.find();
    } else {
      return [];
    }
  }
}