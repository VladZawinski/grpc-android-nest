import { Controller, Logger } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { chat } from './chat';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Metadata, ServerDuplexStream } from '@grpc/grpc-js';

type ChatMessage = chat.ChatMessage;
type ChatService = chat.ChatService;
type ChatConnection = chat.ChatConnection;
type Empty = chat.Empty;

@Controller('chat')
export class ChatController {
  private logger = new Logger('ChatController');
  private connectedUsers = new Map<string, { username: string, stream: Subject<ChatMessage> }>();
  private messageUpdates$ = new Subject<ChatMessage>();
  onModuleInit() {
    this.logger.log('ChatController initialized');
  }
  @GrpcMethod('ChatService', 'Connect')
  connect(data: ChatConnection): Empty {
    const { userId, username } = data;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, { username, stream: new Subject<ChatMessage>() });
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

    this.messageUpdates$.next(message);

    console.log(`Message sent by ${username}: ${content}`);
    return {};
  }
  @GrpcStreamMethod('ChatService', 'OnMessageUpdated')
  onMessageUpdated(
    messages: Observable<any>, metadata: Metadata, call: ServerDuplexStream<any, any>
  ): Observable<ChatMessage> {
    return this.messageUpdates$.asObservable();
  }
  
}
