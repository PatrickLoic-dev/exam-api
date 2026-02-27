import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId, Collection } from 'mongodb';
import { ObjectEntity } from '../entities/object.entity';

@Injectable()
export class ObjectsRepository {

    private collection: Collection<ObjectEntity>;

    constructor(
        @Inject('DATABASE')
        private readonly db: Db,
    ) {
        this.collection = this.db.collection<ObjectEntity>('objects');
    }

    async create(object: ObjectEntity) {

        const result = await this.collection.insertOne({
            ...object,
            createdAt: new Date(),
        });

        return {
            _id: result.insertedId,
            ...object,
        };
    }

    async findAll(): Promise<ObjectEntity[]> {
        return this.collection
            .find()
            .sort({ createdAt: -1 })
            .toArray();
    }

    async findById(id: string) {
        return this.collection.findOne({
            _id: new ObjectId(id),
        });
    }

    async delete(id: string) {
        return this.collection.findOneAndDelete({
            _id: new ObjectId(id),
        });
    }
}