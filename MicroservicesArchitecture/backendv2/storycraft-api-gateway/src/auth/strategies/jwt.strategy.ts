import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtEstrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, 
    });
  }

  async validate(payload: any) {
    const { UserId, exp } = payload;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (exp < currentTimestamp) {
      throw new UnauthorizedException('Token has expired');
    }
    
    return { UserId };
  }
}
