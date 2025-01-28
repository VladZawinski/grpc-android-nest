import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { message } from './message';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

type MessageById = message.MessageById;
type Message = message.Message;

@Controller('message')
export class MessageController {
  @GrpcMethod('MessageService', 'FindOne')
  findOne(
    data: MessageById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Message {
    const items = [
      { id: 1, name: 'Hello' },
      { id: 2, name: 'Welcome' },
    ];
    return items.find(({ id }) => id === data.id);
  }
}
