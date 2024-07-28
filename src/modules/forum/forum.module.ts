import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumGateway } from './forum.gateway';

@Module({
  providers: [ForumGateway, ForumService],
})
export class ForumModule {}
