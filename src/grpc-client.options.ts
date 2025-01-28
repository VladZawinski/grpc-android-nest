import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['message'], // ['hero', 'hero2']
    protoPath: [
        join(__dirname, './message/message.proto'),
    ], // ['./hero/hero.proto', './hero/hero2.proto']
    // onLoadPackageDefinition: (pkg, server) => {
    //   new ReflectionService(pkg).addToServer(server);
    // },
  },
};