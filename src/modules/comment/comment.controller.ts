import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger'
import { Comment } from './entities/comment.entity'

@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor (private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Add comment' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Comment
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async addComment (@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const data = await this.commentService.addComment(createCommentDto)
      return data
    } catch (error) {
      throw new Error(error.message as string)
    }
  }

  @Put()
  @ApiOperation({ summary: 'Modify a comment' })
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: Comment
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateComment (
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<Comment> {
    try {
      const data = await this.commentService.updateComment(updateCommentDto)
      return data
    } catch (error) {
      throw new Error(error.message as string)
    }
  }

  @Get(':bookId')
  async getBookComments (@Param('bookId') bookId: number): Promise<Comment[]> {
    try {
      const data = await this.commentService.getBookComments(bookId)
      return data
    } catch (error) {
      throw new Error(error.message as string)
    }
  }

  @Post('/updateStatus')
  async updateCommentStatus (@Body() updateCommentStatusDto: { commentId: number, status: 'accepted' | 'rejected' }): Promise<any> {
    try {
      await this.commentService.updateCommentStatus(updateCommentStatusDto)
      return {
        success: true,
        message: 'Comment Updated Successfully'
      }
    } catch (error) {
      throw new Error(error.message as string)
    }
  }
}
