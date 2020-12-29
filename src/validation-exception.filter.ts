import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs';

// This will catch the BadRequestExceptions what Validation Pipe throw when a validation criteria does'nt match
// Here I just set up my error json object as I want

@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException> {
  public catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;
    const request = ctx.getRequest() as Request;

    const errors: any = {};

    exception.response.message.forEach((err) => {
      const fieldName = err.split(' ')[0];
      // if the error comes from a bad type image => I delete the image from server
      if (fieldName === 'fileType') {
        console.log(request.file.path);
        fs.unlinkSync(request.file.path);
      }
      errors[fieldName] = err;
    });

    response.status(400).json(errors);
  }
}
