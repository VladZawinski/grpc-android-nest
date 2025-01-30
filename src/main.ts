import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'chat',
        protoPath: join(__dirname, 'chat/chat.proto'),
      },
    },
  );
  // const app = await NestFactory.create(AppModule);
  await app.listen();
}
bootstrap();
