import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';

@Module({
    providers: [
        {
            provide: 'STORAGE_SERVICE',
            useClass: R2Service,
        },
    ],
    exports: ['STORAGE_SERVICE'],
})
export class StorageModule { }