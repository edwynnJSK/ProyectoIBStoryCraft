import {PassportStrategy} from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtEstrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true
        });
    }

    async validate(payload: any) {
        return { userID: payload.sub, username: payload.username };
    }

}