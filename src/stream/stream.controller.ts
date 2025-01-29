import { Metadata, ServerDuplexStream, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { interval, map, Observable, Subject } from 'rxjs';
import { stream } from './stream';

type StreamResponse = stream.StreamResponse;
type StreamRequest = stream.StreamRequest;

@Controller('stream')
export class StreamController {
  @GrpcMethod('StreamService', 'FindOne')
  findOne(
    data: StreamRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): StreamResponse {
    return { message: 'Hello there!' };
  }
  @GrpcStreamMethod('StreamService', 'BidiStrings')
  bidiHello(
    messages: Observable<any>,
    metadata: Metadata,
    call: ServerDuplexStream<any, any>,
  ): Observable<any> {
    const subject = new Subject();

    const onNext = (message) => {
      console.log(message);
      subject.next({
        reply: 'Hello, world!',
      });
    };
    const onComplete = () => subject.complete();
    messages.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
