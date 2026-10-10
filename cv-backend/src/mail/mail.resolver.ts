import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Response } from "@nestjs/common";
import { MailService } from "./mail.service";
import { GetOrigin } from "src/app/decorators/get_origin.decorator";
import { VerifyMailDto } from "./dto/mail.dto";

import { Public } from "src/auth/guards/public.decorator";

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Mutation("sendVerification")
  async sendVerification(@Args("email") email: string, @GetOrigin() origin: string) {
    return await this.mailService.sendVerificationEmail(email, `${origin}/verify-email`);
  }

  @Mutation("verifyMail")
  verifyMail(@Args("mail") args: VerifyMailDto, @Response() { req }) {
    return this.mailService.verifyEmail(args, req.user.email);
  }
}
