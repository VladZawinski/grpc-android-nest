import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [ChatModule, StockModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
