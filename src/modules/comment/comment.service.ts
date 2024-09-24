import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateCommentDto } from './dto/create-comment.dto'
import { type UpdateCommentDto } from './dto/update-comment.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'
import {Status} from "../admin/entities/status.enum";

@Injectable()
export class CommentService {
  private readonly logger = new Logger(AbortController.name)

  constructor(
      @InjectRepository(Comment)
      private readonly commentRepository: Repository<Comment>
  ) {
  }

  async addComment (createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = this.commentRepository.create({
        user: { id: createCommentDto.userId },
        book: { id: createCommentDto.bookId },
        content: createCommentDto.content
      })
      return await this.commentRepository.save(comment)
    } catch (error) {
      this.logger.error('Error adding comment', error.stack)
      throw new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateComment (userId: number, bookId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { user: { id: userId }, book: { id: bookId } }
      })

      if (comment != null) {
        comment.status = updateCommentDto.status
      }

      if (comment != null && updateCommentDto.content != null) {
        comment.content = updateCommentDto.content
      }

      if (comment != null) {
        return await this.commentRepository.save(comment)
      }

      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    } catch (error) {
      this.logger.error('Error updating comment', error.stack)
      throw new HttpException('Failed to update comment', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getBookComments(bookId: number): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: {book: {id: bookId}},
        relations: ['user', 'user.avatar']
      })
    } catch (error) {
      this.logger.error('Error getting book comments', error.stack)
      throw new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findWaiting(): Promise<Comment[]> {
    try {
      return await this.commentRepository.createQueryBuilder('comment')
          .leftJoinAndSelect('comment.user', 'user')
          .leftJoinAndSelect('comment.book', 'book')
          .select([
            'comment.id',
            'comment.content',
            'comment.status',
            'comment.userId',
            'comment.bookId',
            'user.username',
            'book.title'
          ])
          .where('comment.status = :status', {status: Status.WAITING})
          .getMany();
    } catch (error) {
      this.logger.error('Error finding comments waitings', error.stack)
      throw new HttpException('Failed to retrieve comments waitings', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateCommentStatus(updateCommentStatusDto: { commentId: number; status: 'accepted' | 'rejected' }): Promise<void> {
    try {
      const comment = await this.commentRepository.findOne({
        where: {id: updateCommentStatusDto.commentId}
      })

      if (comment != null) {
        switch (updateCommentStatusDto.status) {
          case 'accepted':
            comment.status = Status.ACCEPTED
            break
          case 'rejected':
            comment.status = Status.REFUSED
            break
          default:
            throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST)
        }
      await this.commentRepository.save(comment)
      }

    } catch (error) {
      this.logger.error('Error updating comment status', error.stack)
      throw new HttpException('Failed to update comment status', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
