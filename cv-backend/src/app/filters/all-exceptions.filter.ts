import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";

type HttpResponse = {
  status: (code: number) => { json: (body: unknown) => void };
};

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  catch(exception: unknown, host?: ArgumentsHost) {
    if (host && host.getType<string>() !== "graphql") {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<HttpResponse>();
      if (response && typeof response.status === "function") {
        const status =
          exception instanceof HttpException ? exception.getStatus() : 500;
        const resBody =
          exception instanceof HttpException
            ? exception.getResponse()
            : { statusCode: 500, message: "Internal server error" };
        return response.status(status).json(
          typeof resBody === "object"
            ? resBody
            : { statusCode: status, message: resBody },
        );
      }
    }

    if (exception instanceof HttpException) {
      return exception;
    }

    return new InternalServerErrorException("internalServerError");
  }
}
