import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';
import { STORAGE_SERVICE_TOKEN } from '../common/tokens';

@Module({
    providers: [
        {
            provide: STORAGE_SERVICE_TOKEN,
            useClass: R2Service,
        },
    ],
    exports: [STORAGE_SERVICE_TOKEN],
})
export class StorageModule { }