import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc-client.options';
import { StreamController } from './stream.controller';

@Module({
  controllers: [StreamController],
  imports: [
    ClientsModule.register([
      {
        name: 'STREAM_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
})
export class StreamModule {}
