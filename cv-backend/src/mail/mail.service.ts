import { Injectable, NotFoundException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { VerifyMailInput } from "src/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { MailModel } from "./model/mail.model";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

const mailNotFound = new NotFoundException("mailNotFound");

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(MailModel)
    private readonly mailRepository: Repository<MailModel>,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async findOneByEmail(email: string) {
    return await this.mailRepository.findOne({ where: { email } });
  }

  createOneTimePassword() {
    return [...Array(6)].map(() => (Math.random() * 10) | 0).join("");
  }

  async sendVerificationEmail(email: string, url: string) {
    let mail = await this.findOneByEmail(email);
    const otp = this.createOneTimePassword();

    if (mail) {
      mail.otp = otp;
    } else {
      mail = this.mailRepository.create({ email, otp });
    }
    await this.mailRepository.save(mail);

    console.log(`[MailService] Verification OTP generated for ${email}: ${otp}`);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Verify email.",
        template: "./confirm-email.hbs",
        context: {
          code: otp,
          duration: "2 hours",
          url,
          from: process.env.MAIL_FROM,
        },
      });
      console.log(`[MailService] Verification email sent to ${email}`);
    } catch (err) {
      console.error(`[MailService] Failed to send verification email to ${email}:`, err);
      throw err;
    }
  }

  async verifyEmail({ otp }: VerifyMailInput, email: string) {
    const mail = await this.mailRepository.findOne({
      where: { email, otp },
    });

    if (!mail) {
      throw mailNotFound;
    }

    await this.mailRepository.delete(mail.id);
    await this.usersService.verifyUser(mail.email);
  }

  async sendResetPasswordEmail(email: string, url: string) {
    console.log(`[MailService] Password reset link generated for ${email}: ${url}`);

    try {
      const res = await this.mailerService.sendMail({
        to: email,
        subject: "Password reset.",
        template: "./reset_password.hbs",
        context: {
          duration: "10 minutes",
          url,
          from: process.env.MAIL_FROM,
        },
      });
      console.log(`[MailService] Password reset email sent to ${email}`);
      return res;
    } catch (err) {
      console.error(`[MailService] Failed to send password reset email to ${email}:`, err);
      throw err;
    }
  }
}
