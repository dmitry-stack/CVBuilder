import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json } from "body-parser";
import { AppModule } from "./app/app.module";
import { validationExceptionFactory } from "./app/util/validation.exception-factory";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: "500kb" }));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.getHttpAdapter().get("/", (_req, res) => {
    res.json({ status: "ok", service: "cv-builder-backend" });
  });
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port ${port}: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error("BOOTSTRAP FAILED:", err);
  process.exit(1);
});
