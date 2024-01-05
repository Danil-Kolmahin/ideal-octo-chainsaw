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
      host: 'database',
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientsModule.register([
      {
        name: 'message-broker',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://message-broker:5672'],
          queue: 'queue',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
