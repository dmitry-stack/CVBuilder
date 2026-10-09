import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "./access_token.strategy";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.JWT_SECRET_2 ||
        (process.env.JWT_SECRET ? process.env.JWT_SECRET + "_refresh" : "cvbuilder_jwt_secret_2_refresh"),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
