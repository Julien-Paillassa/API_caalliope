import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateCommentDto } from './dto/create-comment.dto'
import { type UpdateCommentDto } from './dto/update-comment.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from './entities/comment.entity'

@Injectable()
export class CommentService {
  private readonly logger = new Logger(AbortController.name)

  constructor (
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async addComment (createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = this.commentRepository.create({
        user: { id: createCommentDto.userId },
        book: { id: createCommentDto.bookId },
        content: createCommentDto.content,
        rating: createCommentDto.rating
      })
      return await this.commentRepository.save(comment)
    } catch (error) {
      this.logger.error('Error adding comment', error.stack)
      throw new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateComment (updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { user: { id: updateCommentDto.userId }, book: { id: updateCommentDto.bookId } }
      })

      if (comment != null) {
        comment.status = updateCommentDto.status
      }

      if (comment != null && updateCommentDto.content != null) {
        comment.content = updateCommentDto.content
      }

      if (comment != null && updateCommentDto.rating != null) {
        comment.rating = updateCommentDto.rating
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

  async getBookComments (bookId: number): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { book: { id: bookId } },
        relations: ['user', 'user.avatar']
      })
    } catch (error) {
      this.logger.error('Error getting book comments', error.stack)
      throw new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
