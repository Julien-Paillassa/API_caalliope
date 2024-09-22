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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      providers: [
        CommentService,
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

  describe('addComment', () => {
    it('should successfully add a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        userId: 1,
        bookId: 1,
        content: 'This is a great book',
        rating: 5
      }

      const savedComment = {
        id: 1,
        user: { id: createCommentDto.userId },
        book: { id: createCommentDto.bookId },
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        status: Status.WAITING,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(commentRepository, 'create').mockReturnValue(savedComment as Comment)
      jest.spyOn(commentRepository, 'save').mockResolvedValue(savedComment as Comment)

      const result = await service.addComment(createCommentDto)
      expect(result).toEqual(savedComment)
      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        user: { id: createCommentDto.userId },
        book: { id: createCommentDto.bookId },
        content: createCommentDto.content,
        rating: createCommentDto.rating
      })
      expect(mockCommentRepository.save).toHaveBeenCalledWith(savedComment)
    })

    it('should throw an error if saving the comment fails', async () => {
      const createCommentDto: CreateCommentDto = {
        userId: 1,
        bookId: 1,
        content: 'This is a great book',
        rating: 5
      }

      jest.spyOn(commentRepository, 'save').mockRejectedValue(new Error('Failed to save comment'))

      await expect(service.addComment(createCommentDto)).rejects.toThrow(
        new HttpException('Failed to add comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('updateComment', () => {
    it('should successfully update a comment with content and rating', async () => {
      const updateCommentDto: UpdateCommentDto = {
        content: 'This is a bad book',
        rating: 1,
        status: Status.ACCEPTED,
        userId: 1,
        bookId: 1
      }

      const existingComment = {
        id: 1,
        user: { id: 1 },
        book: { id: 1 },
        content: 'Original comment',
        rating: 5,
        status: Status.WAITING
      }

      const newComment = {
        id: 1,
        user: { id: 1 },
        book: { id: 1 },
        content: updateCommentDto.content,
        rating: updateCommentDto.rating,
        status: updateCommentDto.status
      }

      mockCommentRepository.findOne.mockResolvedValue(existingComment as Comment)
      mockCommentRepository.save.mockResolvedValue(newComment as Comment)

      const result = await service.updateComment(updateCommentDto)

      expect(result).toEqual(newComment)
      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 }, book: { id: 1 } }
      })
      expect(mockCommentRepository.save).toHaveBeenCalledWith(newComment)
    })

    it('should update only the status if content and rating are not provided', async () => {
      const updateCommentDto: UpdateCommentDto = {
        status: Status.ACCEPTED,
        userId: 1,
        bookId: 1
      }

      const existingComment = {
        id: 1,
        user: { id: 1 },
        book: { id: 1 },
        content: 'Original comment',
        rating: 5,
        status: Status.WAITING
      }

      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(existingComment as Comment)
      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        ...existingComment as Comment,
        status: updateCommentDto.status
      })

      const result = await service.updateComment(updateCommentDto)

      expect(result).toEqual({
        ...existingComment,
        status: updateCommentDto.status
      })
      expect(mockCommentRepository.save).toHaveBeenCalledWith({
        ...existingComment,
        status: updateCommentDto.status
      })
    })

    it('should throw a 404 error if the comment is not found', async () => {
      jest.spyOn(mockCommentRepository, 'findOne').mockResolvedValue(null)

      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated content',
        status: Status.REFUSED,
        userId: 1,
        bookId: 1
      }

      await expect(service.updateComment(updateCommentDto)).rejects.toThrow(
        new HttpException('Failed to update comment', HttpStatus.NOT_FOUND)
      )
    })

    it('should throw an error if updating the comment fails', async () => {
      const existingComment = {
        id: 1,
        user: { id: 1 },
        book: { id: 1 },
        content: 'Original comment',
        rating: 5
      }

      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(existingComment as Comment)
      jest.spyOn(commentRepository, 'save').mockRejectedValue(new Error('Failed to save comment'))

      const updateCommentDto: UpdateCommentDto = {
        content: 'Updated comment',
        rating: 4,
        status: Status.ACCEPTED,
        userId: 1,
        bookId: 1
      }

      await expect(service.updateComment(updateCommentDto)).rejects.toThrow(
        new HttpException('Failed to update comment', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })

  describe('getBookComments', () => {
    it('should return comments for a book', async () => {
      const bookComments: Comment[] = [
        {
          id: 1,
          content: 'Great book!',
          rating: 5,
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            avatar: new Avatar(),
            password: '',
            email: '',
            username: '',
            role: UserRole.ADMIN,
            userBook: [],
            comment: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          book: {
            id: 1,
            title: 'Book Title',
            cover: new Cover(),
            summary: '',
            publicationDate: '',
            status: Status.WAITING,
            author: new Author(),
            comment: [],
            genre: [],
            userBook: [],
            publishing: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: Status.WAITING,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          content: 'Bad book!',
          rating: 1,
          user: {
            id: 2,
            firstName: 'Johnny',
            lastName: 'Doeny',
            avatar: new Avatar(),
            password: '',
            email: '',
            username: '',
            role: UserRole.ADMIN,
            userBook: [],
            comment: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          book: {
            id: 1,
            title: 'Book Title',
            cover: new Cover(),
            summary: '',
            publicationDate: '',
            status: Status.WAITING,
            author: new Author(),
            comment: [],
            genre: [],
            userBook: [],
            publishing: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: Status.WAITING,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      jest.spyOn(commentRepository, 'find').mockResolvedValue(bookComments)

      const result = await service.getBookComments(1)

      expect(result).toEqual(bookComments)
      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { book: { id: 1 } },
        relations: ['user', 'user.avatar']
      })
    })

    it('should throw an error if getting the comments fails', async () => {
      jest.spyOn(commentRepository, 'find').mockRejectedValue(new Error('Failed to get comments'))

      await expect(service.getBookComments(1)).rejects.toThrow(
        new HttpException('Failed to get book comments', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})
