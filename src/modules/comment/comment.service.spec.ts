import { Test, type TestingModule } from '@nestjs/testing'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Status } from '../admin/entities/status.enum'

describe('CommentController', () => {
  let controller: CommentController
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CommentService

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
        }
      ]
    }).compile()

    controller = module.get<CommentController>(CommentController)
    service = module.get<CommentService>(CommentService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('addComment', () => {
    it('should add a comment', async () => {
      const createCommentDto = { userId: 1, bookId: 1, content: 'Great book!' }
      const savedComment = { id: 1, ...createCommentDto }

      mockCommentService.addComment.mockResolvedValue(savedComment)

      const result = await controller.addComment(createCommentDto)
      expect(result).toEqual(savedComment)
      expect(mockCommentService.addComment).toHaveBeenCalledWith(createCommentDto)
    })

    it('should throw an error if adding a comment fails', async () => {
      const createCommentDto = { userId: 1, bookId: 1, content: 'Great book!' }

      mockCommentService.addComment.mockRejectedValue(
        new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )

      await expect(controller.addComment(createCommentDto)).rejects.toThrow(
        new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updateCommentDto = { status: Status.ACCEPTED, content: 'Updated content' }
      const updatedComment = { id: 1, ...updateCommentDto }

      mockCommentService.updateComment.mockResolvedValue(updatedComment)

      const result = await controller.updateComment(1, 1, updateCommentDto)
      expect(result).toEqual(updatedComment)
      expect(mockCommentService.updateComment).toHaveBeenCalledWith(1, 1, updateCommentDto)
    })

    it('should throw an error if updating a comment fails', async () => {
      const updateCommentDto = { status: Status.ACCEPTED, content: 'Updated content' }

      mockCommentService.updateComment.mockRejectedValue(
        new HttpException('Failed to update comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )

      await expect(controller.updateComment(1, 1, updateCommentDto)).rejects.toThrow(
        new HttpException('Failed to update comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('getBookComments', () => {
    it('should return book comments', async () => {
      const bookComments = [{ id: 1, content: 'Great book!' }]
      mockCommentService.getBookComments.mockResolvedValue(bookComments)

      const result = await controller.getBookComments(1)
      expect(result).toEqual(bookComments)
      expect(mockCommentService.getBookComments).toHaveBeenCalledWith(1)
    })

    it('should throw an error if fetching comments fails', async () => {
      mockCommentService.getBookComments.mockRejectedValue(
        new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
      )

      await expect(controller.getBookComments(1)).rejects.toThrow(
        new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})
