import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [MessageModule, StreamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
