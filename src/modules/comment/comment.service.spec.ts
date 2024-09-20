import { Test, type TestingModule } from '@nestjs/testing'
import { CommentService } from './comment.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { Comment } from './entities/comment.entity'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Status } from '../admin/entities/status.enum'

describe('CommentService', () => {
  let service: CommentService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let commentRepository: Repository<Comment>

  // Mock repository
  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository
        }
      ]
    }).compile()

    service = module.get<CommentService>(CommentService)
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('addComment', () => {
    it('should add a comment', async () => {
      const createCommentDto = { userId: 1, bookId: 1, content: 'Great book!' }
      const savedComment = { id: 1, ...createCommentDto }

      mockCommentRepository.create.mockReturnValue(savedComment)
      mockCommentRepository.save.mockResolvedValue(savedComment)

      const result = await service.addComment(createCommentDto)
      expect(result).toEqual(savedComment)
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        user: { id: createCommentDto.userId },
        book: { id: createCommentDto.bookId },
        content: createCommentDto.content
      })
      expect(mockCommentRepository.save).toHaveBeenCalledWith(savedComment)
    })

    it('should throw an error if save fails', async () => {
      const createCommentDto = { userId: 1, bookId: 1, content: 'Great book!' }

      mockCommentRepository.save.mockRejectedValue(new Error('Save failed'))

      await expect(service.addComment(createCommentDto)).rejects.toThrow(
        new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )
      expect(mockCommentRepository.create).toHaveBeenCalled()
    })
  })

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const updateCommentDto = { status: Status.ACCEPTED, content: 'Updated content' }
      const existingComment = { id: 1, user: { id: 1 }, book: { id: 1 }, content: 'Old content', status: Status.WAITING }

      mockCommentRepository.findOne.mockResolvedValue(existingComment)
      mockCommentRepository.save.mockResolvedValue({ ...existingComment, ...updateCommentDto })

      const result = await service.updateComment(1, 1, updateCommentDto)
      expect(result).toEqual({ ...existingComment, ...updateCommentDto })
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 }, book: { id: 1 } }
      })
      expect(mockCommentRepository.save).toHaveBeenCalledWith({ ...existingComment, ...updateCommentDto })
    })

    it('should throw an error if comment is not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null)

      await expect(service.updateComment(1, 1, { content: 'Updated content', status: Status.ACCEPTED })).rejects.toThrow(
        new HttpException('Comment not found', HttpStatus.NOT_FOUND)
      )
    })
  })

  describe('getBookComments', () => {
    it('should return book comments', async () => {
      const bookComments = [{ id: 1, content: 'Great book!' }]

      mockCommentRepository.find.mockResolvedValue(bookComments)

      const result = await service.getBookComments(1)
      expect(result).toEqual(bookComments)
      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { book: { id: 1 } },
        relations: ['user', 'user.avatar']
      })
    })

    it('should throw an error if fetching comments fails', async () => {
      mockCommentRepository.find.mockRejectedValue(new Error('Fetch failed'))

      await expect(service.getBookComments(1)).rejects.toThrow(
        new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})
