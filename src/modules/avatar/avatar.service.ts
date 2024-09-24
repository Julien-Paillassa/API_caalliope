import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Avatar } from './entities/avatar.entity'
import { Author } from './../author/entities/author.entity'
import { User } from '../user/entities/user.entity'
import { promises as fsPromises } from 'fs'

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name)

  constructor (
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async uploadAvatar(avatar: Express.Multer.File, userId: number): Promise<any> {
    try {
      if (avatar === undefined || avatar === null) {
        throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
      }

      await fsPromises.mkdir('./uploads/avatars/', { recursive: true });

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['avatar']
      });

      if (user === null || user === undefined) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.avatar !== undefined) {
        const oldAvatarPath = `./uploads/avatars/${user.avatar.filename}`;
        try {
          await fsPromises.unlink(oldAvatarPath);
        } catch (err) {
          this.logger.warn(`Failed to delete old avatar for user ${userId}: ${err.message}`);
        }
      }

      const filename = `${userId}_avatar${avatar.originalname.slice(avatar.originalname.lastIndexOf('.'))}`;
      const filePath = `./uploads/avatars/${filename}`;

      await fsPromises.copyFile(avatar.path, filePath);
      await fsPromises.unlink(avatar.path);

      if (user.avatar !== null || user.avatar !== undefined) {
        user.avatar.filename = filename;
        await this.avatarRepository.save(user.avatar);
      } else {
        const newAvatar = this.avatarRepository.create({
          filename,
          user
        });
        await this.avatarRepository.save(newAvatar);
      }

      return { message: 'Avatar uploaded successfully', filename };

    } catch (error) {
      this.logger.error('Error uploading avatar', error.stack);
      throw new HttpException('Failed to upload avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async saveAvatar (filename: string, user?: User, author?: Author): Promise<any> {
    try {
      if (user !== undefined) {
        const avatar = this.avatarRepository.create({
          filename,
          user
        })

        return await this.avatarRepository.save(avatar)
      } else if (author !== undefined) {
        const avatar = this.avatarRepository.create({
          filename,
          author
        })

        const authorToUpdate = await this.authorRepository.findOne({
          where: { id: author.id },
          relations: ['avatar']
        })

        if (authorToUpdate != null) {
          authorToUpdate.avatar = avatar
          await this.authorRepository.save(authorToUpdate)
        }

        return await this.avatarRepository.save(avatar)
      }
    } catch (error) {
      this.logger.error('Error creating avatar', error.stack)
      throw new HttpException('Failed to save avatar', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByAuthorId (id: number): Promise<any> {
    try {
      const avatar = await this.avatarRepository.findOne({
        where: { author: { id } },
        relations: ['author']
      })
      if (avatar === null) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND)
      }

      return avatar
    } catch (error) {
      this.logger.error('Error finding avatar by author ID', error.stack)
      throw new HttpException('Failed to find author avatar', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findByUserId (id: number): Promise<any> {
    try {
      const avatar = await this.avatarRepository.findOne({
        where: { user: { id } },
        relations: ['user']
      })
      if (avatar === null) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND)
      }

      return avatar
    } catch (error) {
      this.logger.error('Error finding avatar by user ID', error.stack)
      throw new HttpException('Failed to find user avatar', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateAvatar (avatar: any): Promise<any> {
    try {
      return await this.avatarRepository.save(avatar)
    } catch (error) {
      this.logger.error('Error updating avatar', error.stack)
      throw new HttpException('Failed to update avatar', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteAvatar (id: number): Promise<Avatar> {
    try {
      const avatar = await this.avatarRepository.findOneBy({ id })
      if (avatar === null) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND)
      }

      return await this.avatarRepository.remove(avatar)
    } catch (error) {
      this.logger.error('Error deleting avatar', error.stack)
      throw new HttpException('Failed to delete avatar', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
