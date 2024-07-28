import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserController } from './modules/user/user.controller'
import { UserModule } from './modules/user/user.module'
import { UserService } from './modules/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm' // Add this import
import { User } from './modules/user/entities/user.entity'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
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
