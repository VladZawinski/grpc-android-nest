import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc-client.options';

@Module({
  controllers: [ChatController],
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ]
})
export class ChatModule {}
