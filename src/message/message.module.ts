import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc-client.options';

@Module({
  controllers: [MessageController],
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ]
})
export class MessageModule {}
