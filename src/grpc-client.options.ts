import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['chat'],
    protoPath: [
        join(__dirname, './chat/chat.proto'),
    ],
  },
};