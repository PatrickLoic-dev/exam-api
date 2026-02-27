import { Provider } from '@nestjs/common';
import { Database } from './mongodb.service';
import { DATABASE_TOKEN } from '../common/tokens';

export const DatabaseProvider: Provider = {
    provide: DATABASE_TOKEN,
    useFactory: async () => {
        try {
            const database = Database.getInstance();
            return await database.getDatabase();
        } catch (error) {
            throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
    },
};