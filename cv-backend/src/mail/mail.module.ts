import { join } from "path";
import { existsSync } from "fs";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { UsersModule } from "src/users/users.module";
import { MailService } from "./mail.service";
import { MailModel } from "./model/mail.model";
import { MailResolver } from "./mail.resolver";

function getMailTransportConfig() {
  const smtpUrl = process.env.SMTP_URL;
  if (!smtpUrl) {
    return {
      host: "localhost",
      port: 1025,
      ignoreTLS: true,
    };
  }

  try {
    const parsed = new URL(smtpUrl);
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 587,
      secure: parsed.port === "465",
      auth: {
        user: decodeURIComponent(parsed.username),
        pass: decodeURIComponent(parsed.password),
      },
      pool: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    };
  } catch {
    return {
      url: smtpUrl,
      pool: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    };
  }
}

function getTemplateDir() {
  const distDir = join(__dirname, "templates");
  if (existsSync(distDir)) return distDir;
  const srcDir = join(process.cwd(), "src", "mail", "templates");
  if (existsSync(srcDir)) return srcDir;
  return distDir;
}

@Module({
  imports: [
    TypeOrmModule.forFeature([MailModel]),
    MailerModule.forRoot({
      transport: getMailTransportConfig(),
      defaults: {
        from: `"CV Innowise" <${process.env.MAIL_FROM || "noreply@yourdomain.com"}>`,
      },
      template: {
        dir: getTemplateDir(),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
  ],
  providers: [MailResolver, MailService],
  exports: [MailService],
})
export class MailModule {}
