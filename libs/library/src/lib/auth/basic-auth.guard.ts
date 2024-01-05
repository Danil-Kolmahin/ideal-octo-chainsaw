import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const [type, data] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Basic') throw new UnauthorizedException();

    const [, password] = Buffer.from(data, 'base64').toString().split(':');

    if (password === process.env.API_PASSWORD) return true;

    throw new UnauthorizedException();
  }
}
