/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, type TestingModule } from '@nestjs/testing'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { Comment } from './entities/comment.entity'
import { HttpException, HttpStatus } from '@nestjs/common'
import { type CreateCommentDto } from './dto/create-comment.dto'
import { type UpdateCommentDto } from './dto/update-comment.dto'
import { Status } from '../admin/entities/status.enum'
import { Avatar } from '../avatar/entities/avatar.entity'
import { Cover } from '../cover/entities/cover.entity'
import { UserRole } from '../user/entities/user-role.enum'
import { Author } from '../author/entities/author.entity'

const mockCommentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn()
}

describe('CommentController', () => {
  let controller: CommentController
  let service: CommentService
  let commentRepository: Repository<Comment>

  // Mock the CommentService
  const mockCommentService = {
    addComment: jest.fn(),
    updateComment: jest.fn(),
    getBookComments: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository
        }
      ]
    }).compile()

    controller = module.get<CommentController>(CommentController)
    service = module.get<CommentService>(CommentService)
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment))
  })

  // Test du contrôleur: addComment
  describe('addComment', () => {
    it('should successfully call the service to add a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        userId: 1,
        bookId: 1,
        content: 'This is a great book'
      }

      const savedComment = {
        id: 1,
        user: { id: createCommentDto.userId },
        book: { id: createCommentDto.bookId },
        content: createCommentDto.content,
        status: Status.WAITING,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockCommentService.addComment.mockResolvedValue(savedComment)

      const result = await controller.addComment(createCommentDto)

      expect(result).toEqual(savedComment)
      expect(mockCommentService.addComment).toHaveBeenCalledWith(createCommentDto)
    })

    it('should throw an error if the service throws', async () => {
      const createCommentDto: CreateCommentDto = {
        userId: 1,
        bookId: 1,
        content: 'This is a great book'
      }

      mockCommentService.addComment.mockRejectedValue(new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR))

      await expect(controller.addComment(createCommentDto)).rejects.toThrow(
        new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  // Test du contrôleur: updateComment
  describe('updateComment', () => {
    it('should successfully call the service to update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'This is a bad book',
        status: Status.ACCEPTED,
        userId: 1,
        bookId: 1
      }

      const updatedComment = {
        id: 1,
        user: { id: 1 },
        book: { id: 1 },
        content: updateCommentDto.content,
        status: updateCommentDto.status
      }

      mockCommentService.updateComment.mockResolvedValue(updatedComment)

      const result = await controller.updateComment(updateCommentDto)

      expect(result).toEqual(updatedComment)
      expect(mockCommentService.updateComment).toHaveBeenCalledWith(updateCommentDto)
    })

    it('should throw a 404 error if the service throws a not found exception', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated content',
        status: Status.REFUSED,
        userId: 1,
        bookId: 1
      }

      mockCommentService.updateComment.mockRejectedValue(new HttpException('Failed to update comment', HttpStatus.NOT_FOUND))

      await expect(controller.updateComment(updateCommentDto)).rejects.toThrow(
        new HttpException('Failed to update comment', HttpStatus.NOT_FOUND)
      )
    })
  })

  // Test du contrôleur: getBookComments
  describe('getBookComments', () => {
    it('should successfully return comments for a book', async () => {
      const bookComments = [
        { id: 1, content: 'Great book!', user: { id: 1 }, book: { id: 1 }, status: Status.WAITING },
        { id: 2, content: 'Bad book!', user: { id: 2 }, book: { id: 1 }, status: Status.WAITING }
      ]

      mockCommentService.getBookComments.mockResolvedValue(bookComments)

      const result = await controller.getBookComments(1)

      expect(result).toEqual(bookComments)
      expect(mockCommentService.getBookComments).toHaveBeenCalledWith(1)
    })

    it('should throw an error if the service throws', async () => {
      mockCommentService.getBookComments.mockRejectedValue(new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR))

      await expect(controller.getBookComments(1)).rejects.toThrow(
        new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})
