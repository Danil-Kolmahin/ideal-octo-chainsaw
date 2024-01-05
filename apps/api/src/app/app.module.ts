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
      host: process.env.NODE_ENV === 'production' ? 'database' : 'localhost',
      username: 'dev',
      password: process.env.DATABASE_PASSWORD,
      database: 'ideal-octo-chainsaw',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientsModule.register([
      {
        name: 'message-broker',
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://dev:${process.env.MESSAGE_BROKER_PASSWORD}@${
              process.env.NODE_ENV === 'production'
                ? 'message-broker'
                : 'localhost'
            }`,
          ],
          queue: 'ideal-octo-chainsaw',
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
