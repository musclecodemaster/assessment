import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, Role } from '@task-management-system/data';
import { CreateTaskDto, UpdateTaskDto } from '@task-management-system/data';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private auditLogService: AuditLogService
  ) {}

  async create(createTaskDto: CreateTaskDto, user: any) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId: user.id,
      organizationId: user.organizationId,
    });
    await this.taskRepository.save(task);
    await this.auditLogService.log(user.id, `Task created: ${task.id}`);
    return task;
  }

  async findAll(user: any) {
    const { role, organizationId } = user;
    if (role === Role.Owner) {
      return this.taskRepository.find({
        where: [
          { organizationId },
          { organization: { parentId: organizationId } },
        ],
      });
    } else if (role === Role.Admin) {
      return this.taskRepository.find({ where: { organizationId } });
    } else {
      return this.taskRepository.find({ where: { userId: user.id } });
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task || (task.userId !== user.id && user.role !== Role.Owner && user.role !== Role.Admin)) {
      throw new ForbiddenException('Access denied');
    }
    await this.taskRepository.update(id, updateTaskDto);
    await this.auditLogService.log(user.id, `Task updated: ${id}`);
    return this.taskRepository.findOne({ where: { id } });
  }

  async delete(id: number, user: any) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task || (user.role !== Role.Owner && user.role !== Role.Admin)) {
      throw new ForbiddenException('Access denied');
    }
    await this.taskRepository.delete(id);
    await this.auditLogService.log(user.id, `Task deleted: ${id}`);
    return { message: 'Task deleted' };
  }
}