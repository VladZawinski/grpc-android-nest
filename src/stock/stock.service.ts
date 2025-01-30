import { Injectable } from '@nestjs/common';
import { interval, map, Observable, Subject } from 'rxjs';

@Injectable()
export class StockService {
  private stockData$ = new Subject<{ symbol: string; price: number }[]>();
  constructor() {
    this.startStockUpdates();
  }
  getStockDataStream(): Observable<{ symbol: string; price: number }[]> {
    return this.stockData$.asObservable();
  }

  private startStockUpdates() {
    const stockData = [
      { symbol: 'BTC', price: this.getRandomPrice() },
      { symbol: 'ETH', price: this.getRandomPrice() },
    ];

    interval(5000)
      .pipe(
        map(() => {
          stockData.forEach((stock) => {
            stock.price = this.getRandomPrice();
          });
          this.stockData$.next(stockData);
        }),
      )
      .subscribe();
  }

  private getRandomPrice(): number {
    return parseFloat((Math.random() * 1000).toFixed(2));
  }
}
