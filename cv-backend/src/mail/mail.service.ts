import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Resend } from "resend";
import { VerifyMailInput } from "src/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { MailModel } from "./model/mail.model";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

const mailNotFound = new NotFoundException("mailNotFound");

function getTemplateDir(): string {
  const distDir = path.join(__dirname, "templates");
  if (fs.existsSync(distDir)) return distDir;
  const srcDir = path.join(process.cwd(), "src", "mail", "templates");
  if (fs.existsSync(srcDir)) return srcDir;
  return distDir;
}

function renderTemplate(
  templateFile: string,
  context: Record<string, unknown>,
): string {
  const templatePath = path.join(getTemplateDir(), templateFile);
  const source = fs.readFileSync(templatePath, "utf-8");
  return handlebars.compile(source)(context);
}

@Injectable()
export class MailService {
  private readonly resend: Resend | null;

  constructor(
    @InjectRepository(MailModel)
    private readonly mailRepository: Repository<MailModel>,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {
    this.resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;
  }

  private async dispatch(options: {
    to: string;
    subject: string;
    templateFile: string;
    nodemailerTemplate: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    const { to, subject, templateFile, nodemailerTemplate, context } = options;

    if (this.resend) {
      // HTTP-based — works on Render free tier (no SMTP port restrictions)
      const html = renderTemplate(templateFile, context);
      const from = process.env.MAIL_FROM
        ? `CV Builder <${process.env.MAIL_FROM}>`
        : "CV Builder <onboarding@resend.dev>";

      const { error } = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        throw new Error(`Resend error: ${error.message}`);
      }
    } else {
      // Nodemailer / SMTP fallback (local dev)
      await this.mailerService.sendMail({
        to,
        subject,
        template: nodemailerTemplate,
        context,
      });
    }
  }

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

    console.log(
      `[MailService] Verification OTP generated for ${email}: ${otp}`,
    );

    if (!process.env.SMTP_URL && !process.env.RESEND_API_KEY) {
      console.warn(
        "[MailService] Neither SMTP_URL nor RESEND_API_KEY configured; skipping email dispatch.",
      );
      return;
    }

    try {
      await this.dispatch({
        to: email,
        subject: "Verify email.",
        templateFile: "confirm-email.hbs",
        nodemailerTemplate: "./confirm-email.hbs",
        context: {
          code: otp,
          duration: "2 hours",
          url,
          from: process.env.MAIL_FROM,
        },
      });
      console.log(`[MailService] Verification email sent to ${email}`);
    } catch (err) {
      console.error(
        `[MailService] Failed to send verification email to ${email}:`,
        err,
      );
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
    console.log(
      `[MailService] Password reset link generated for ${email}: ${url}`,
    );

    if (!process.env.SMTP_URL && !process.env.RESEND_API_KEY) {
      console.warn(
        "[MailService] Neither SMTP_URL nor RESEND_API_KEY configured; skipping email dispatch.",
      );
      return;
    }

    try {
      await this.dispatch({
        to: email,
        subject: "Password reset.",
        templateFile: "reset_password.hbs",
        nodemailerTemplate: "./reset_password.hbs",
        context: {
          duration: "10 minutes",
          url,
          from: process.env.MAIL_FROM,
        },
      });
      console.log(`[MailService] Password reset email sent to ${email}`);
    } catch (err) {
      console.error(
        `[MailService] Failed to send password reset email to ${email}:`,
        err,
      );
      throw err;
    }
  }
}
