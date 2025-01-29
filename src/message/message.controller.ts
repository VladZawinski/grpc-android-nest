import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { message } from './message';
import { Metadata, ServerDuplexStream, ServerUnaryCall } from '@grpc/grpc-js';
import { interval, map, Observable, Subject, takeUntil } from 'rxjs';

type MessageById = message.MessageById;
type Message = message.Message;

@Controller('message')
export class MessageController {
  @GrpcMethod('MessageService', 'FindOne')
  findOne(
    data: MessageById,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Message {
    const items = [
      { id: 1, name: 'Hello' },
      { id: 2, name: 'Welcome' },
    ];
    return items.find(({ id }) => id === data.id);
  }@GrpcStreamMethod('MessageService', 'FindMany')
  findMany(
    data: Observable<any>,
    metadata: Metadata,
    call: ServerDuplexStream<any, any>,
  ): Observable<Message> {
    const subject = new Subject<Message>();
    const stop$ = new Subject<void>();

    const messageInterval$ = interval(5000).pipe(
      map(() => ({
        id: Math.floor(Math.random() * 100),
        name: 'Hello, world!',
      })),
      takeUntil(stop$)
    );
    const subscription = messageInterval$.subscribe((message) => {
      console.log(message);
      subject.next(message);
    });

    const onComplete = () => {
      stop$.next();
      stop$.complete();
      subscription.unsubscribe();
      subject.complete();
    };

    data.subscribe({
      next: (incomingMessage) => {
        console.log('Received:', incomingMessage);
      },
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
