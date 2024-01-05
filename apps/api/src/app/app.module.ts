import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { LibraryModule } from '@ideal-octo-chainsaw/library';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LibraryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'database',
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientsModule.register([
      {
        name: 'message-broker',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${
              process.env.MESSAGE_BROKER_HOST || 'message-broker'
            }:5672`,
          ],
          queue: process.env.MESSAGE_BROKER_QUEUE || 'queue',
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
