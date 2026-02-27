import { Provider } from '@nestjs/common';
import { Database } from './mongodb.service';

export const DatabaseProvider: Provider = {
    provide: 'DATABASE',
    useFactory: async () => {
        const database = Database.getInstance();
        return await database.getDatabase();
    },
};