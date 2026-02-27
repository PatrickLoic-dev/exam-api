import { ObjectId } from 'mongodb';

export class ObjectEntity {
    _id?: ObjectId;

    title!: string;
    description!: string;
    imageUrl!: string;

    createdAt!: Date;

    constructor(partial: Partial<ObjectEntity>) {
        Object.assign(this, partial);
    }
}