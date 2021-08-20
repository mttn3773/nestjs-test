import { LocalStrategy } from './passport/local.strategy';
import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './../users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
