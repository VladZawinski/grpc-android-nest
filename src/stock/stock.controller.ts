import { Metadata, ServerDuplexStream } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { interval, map, Observable, Subject } from 'rxjs';
import { stock } from './stock';
import { StockService } from './stock.service';

type StockList = stock.StockList;

@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) {}
    @GrpcStreamMethod('StockService', 'GetStockUpdates')
    getStockUpdates(
      messages: Observable<any>,
          metadata: Metadata,
          call: ServerDuplexStream<any, any>,
    ): Observable<StockList> {
        return this.stockService.getStockDataStream().pipe(
            map((stockData) => {
              return { stock: stockData };
            }),
          );
    }
}
