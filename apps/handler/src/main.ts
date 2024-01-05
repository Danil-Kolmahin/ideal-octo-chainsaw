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
        `amqp://${process.env.MESSAGE_BROKER_HOST || 'message-broker'}:5672`,
      ],
      queue: process.env.MESSAGE_BROKER_QUEUE || 'queue',
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT || 3002;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
