import { Controller, Logger } from '@nestjs/common';
import { interval, map, Observable, Subject } from 'rxjs';
import { chat } from './chat';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata, ServerDuplexStream } from '@grpc/grpc-js';

type ChatMessage = chat.ChatMessage;
type ChatConnection = chat.ChatConnection;
type MessageList = chat.MessageList;
type Empty = chat.Empty;


@Controller('chat')
export class ChatController {
  private logger = new Logger('ChatController');
  private connectedUsers = new Map<
    string,
    { username: string; stream: Subject<ChatMessage> }
  >();
  private messages: ChatMessage[] = [];
  private messageUpdates$ = new Subject<MessageList>();
  onModuleInit() {
    this.logger.log('ChatController initialized');
  }
  @GrpcMethod('ChatService', 'Connect')
  connect(data: ChatConnection): Empty {
    const { userId, username } = data;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, {
        username,
        stream: new Subject<ChatMessage>(),
      });
      console.log(`${username} connected`);
    } else {
      console.log(`${username} reconnected`);
    }

    return {};
  }

  @GrpcMethod('ChatService', 'SendMessage')
  sendMessage(data: ChatMessage): Empty {
    const { userId, username, content, timestamp } = data;

    const message: ChatMessage = {
      userId,
      username,
      content,
      timestamp,
    };
    this.messages.push(message);
    this.messageUpdates$.next({
      messages: this.messages,
    });

    console.log(`Message sent by ${username}: ${content}`);
    return {};
  }
  @GrpcStreamMethod('ChatService', 'OnMessageUpdated')
  onMessageUpdated(
    messages: Observable<any>,
    metadata: Metadata,
    call: ServerDuplexStream<any, any>,
  ): Observable<MessageList> {
    return this.messageUpdates$.asObservable();
  }
}
