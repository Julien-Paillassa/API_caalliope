import { Module } from '@nestjs/common'
import { AvatarService } from './avatar.service'
import { AvatarController } from './avatar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Avatar } from './entities/avatar.entity'
import { Author } from '../author/entities/author.entity'
import { AuthorService } from '../author/author.service'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Avatar, Author, User])],
  controllers: [AvatarController],
  providers: [AvatarService, AuthorService, UserService],
  exports: [TypeOrmModule, AvatarService]
})
export class AvatarModule {}
