import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['chat', 'stock'],
    protoPath: [
        join(__dirname, './chat/chat.proto'),
        join(__dirname, './stock/stock.proto'),
    ],
  },
};