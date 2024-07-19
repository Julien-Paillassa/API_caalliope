import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { UserService } from './user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm' // Add this import
import { User } from './user/entities/user.entity'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'caaliope',
      password: 'caaliope_dev*2024!',
      database: 'database_caaliope_dev',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService]
})
export class AppModule {}
