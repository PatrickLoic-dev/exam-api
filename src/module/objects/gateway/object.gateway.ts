import {
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
    cors: true,
})
export class ObjectsGateway {

    @WebSocketServer()
    server!: Server;

    emitCreated(object: any) {
        this.server.emit('object.created', object);
    }

    emitDeleted(id: string) {
        this.server.emit('object.deleted', id);
    }
}