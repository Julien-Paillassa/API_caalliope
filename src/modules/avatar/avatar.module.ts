import {forwardRef, Module} from '@nestjs/common'
import { AvatarService } from './avatar.service'
import { AvatarController } from './avatar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Avatar } from './entities/avatar.entity'
import { Author } from '../author/entities/author.entity'
import { AuthorService } from '../author/author.service'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'
import { Book } from '../book/entities/book.entity'
import { BookService } from '../book/book.service'
import {OrchestratorService} from "../orchestrator/ochestrator.service";
import {OrchestratorModule} from "../orchestrator/orchestrator.module";

@Module({
  imports: [TypeOrmModule.forFeature([Avatar, Author, User, Book]), forwardRef(() => OrchestratorModule)],
  controllers: [AvatarController],
  providers: [AvatarService, AuthorService, UserService, BookService, OrchestratorService],
  exports: [TypeOrmModule, AvatarService]
})
export class AvatarModule {}
