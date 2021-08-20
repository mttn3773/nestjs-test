import { AuthService } from './auth/services/auth.service';
import { AuthController } from './auth/controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { UsersController } from './users/controllers/users.controller';
import { UsersService } from './users/services/users.service';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UsersModule,
    TagsModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule {
  constructor(private connecion: Connection) {}
}
