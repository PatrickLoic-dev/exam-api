import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import type { Multer } from 'multer';
import { StorageService } from './storage.interface';
import { config } from '../../config';

@Injectable()
export class R2Service implements StorageService {

    private client = new S3Client({
        region: 'auto',
        endpoint: `https://${config.get('r2.accountId')}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: config.get('r2.accessKey'),
            secretAccessKey: config.get('r2.secretKey'),
        },
    });

    async upload(file: Express.Multer.File): Promise<string> {

        const key = `${uuid()}-${file.originalname}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: config.get('r2.bucket'),
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `${config.get('r2.publicUrl')}/${key}`;
    }

    async delete(fileUrl: string): Promise<void> {

        const key = new URL(fileUrl).pathname.slice(1);

        await this.client.send(
            new DeleteObjectCommand({
                Bucket: config.get('r2.bucket'),
                Key: key,
            }),
        );
    }
}