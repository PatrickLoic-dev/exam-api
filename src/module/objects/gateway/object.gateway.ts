import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ObjectEntity } from '../entities/object.entity';

@WebSocketGateway({
    cors: true,
})
export class ObjectsGateway {

    @WebSocketServer()
    server!: Server;

    emitCreated(object: ObjectEntity) {
        this.server.emit('object.created', object);
    }

    emitDeleted(id: string) {
        this.server.emit('object.deleted', id);
    }
}