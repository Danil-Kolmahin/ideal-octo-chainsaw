import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://dev:${process.env.MESSAGE_BROKER_PASSWORD}@${
          process.env.NODE_ENV === 'production' ? 'message-broker' : 'localhost'
        }`,
      ],
      queue: 'ideal-octo-chainsaw',
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  const port = process.env.NODE_ENV === 'production' ? 80 : 3002;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
