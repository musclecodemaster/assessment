import { Module } from '@nestjs/common';
import { AuthGuard } from '@task-management-system/auth';

@Module({
  providers: [AuthGuard],
})
export class AuthModule {}