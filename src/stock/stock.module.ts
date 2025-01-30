import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc-client.options';
import { StockService } from './stock.service';

@Module({
  controllers: [StockController],
  imports: [
      ClientsModule.register([
        {
          name: 'STOCK_PACKAGE',
          ...grpcClientOptions,
        },
      ]),
    ],
  providers: [StockService]
})
export class StockModule {}
