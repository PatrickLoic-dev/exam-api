import { Module, Global } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';

@Global()
@Module({
    providers: [DatabaseProvider],
    exports: [DatabaseProvider],
})
export class DatabaseModule { }