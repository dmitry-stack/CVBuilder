import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRole } from "src/graphql";

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  jti?: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        process.env.AUTH_SECRET ||
        "cvbuilder_jwt_secret_key_default",
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
