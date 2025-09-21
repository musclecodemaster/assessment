import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, Role } from '@task-management-system/data';
import { AuthGuard } from '@nestjs/passport';
import { Roles, Permissions } from '@task-management-system/auth';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.Owner, Role.Admin)
  @Permissions('create_task')
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.taskService.create(createTaskDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.taskService.findAll(req.user);
  }

  @Put(':id')
  @Permissions('edit_task')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.taskService.update(+id, updateTaskDto, req.user);
  }

  @Delete(':id')
  @Permissions('delete_task')
  delete(@Param('id') id: string, @Request() req) {
    return this.taskService.delete(+id, req.user);
  }
}