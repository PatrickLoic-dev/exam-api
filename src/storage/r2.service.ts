import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import type { Multer } from 'multer';
import { StorageService } from './storage.interface';

@Injectable()
export class R2Service implements StorageService {

    private client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY!,
            secretAccessKey: process.env.R2_SECRET_KEY!,
        },
    });

    async upload(file: Express.Multer.File): Promise<string> {

        const key = `${uuid()}-${file.originalname}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `${process.env.R2_PUBLIC_URL}/${key}`;
    }

    async delete(fileUrl: string): Promise<void> {

        const key = fileUrl.split('/').pop();

        await this.client.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: key,
            }),
        );
    }
}