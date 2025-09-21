import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@task-management-system/auth';
import { Role } from '@task-management-system/data';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
@UseGuards(AuthGuard('jwt'))
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(Role.Owner, Role.Admin)
  findAll(@Request() req) {
    return this.auditLogService.findAll(req.user);
  }
}