import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ForumService } from './forum.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';

@WebSocketGateway()
export class ForumGateway {
  constructor(private readonly forumService: ForumService) {}

  @SubscribeMessage('createForum')
  create(@MessageBody() createForumDto: CreateForumDto) {
    return this.forumService.create(createForumDto);
  }

  @SubscribeMessage('findAllForum')
  findAll() {
    return this.forumService.findAll();
  }

  @SubscribeMessage('findOneForum')
  findOne(@MessageBody() id: number) {
    return this.forumService.findOne(id);
  }

  @SubscribeMessage('updateForum')
  update(@MessageBody() updateForumDto: UpdateForumDto) {
    return this.forumService.update(updateForumDto.id, updateForumDto);
  }

  @SubscribeMessage('removeForum')
  remove(@MessageBody() id: number) {
    return this.forumService.remove(id);
  }
}
