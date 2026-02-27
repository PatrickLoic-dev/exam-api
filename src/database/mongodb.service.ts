import { LoggerService } from '../common/logging/logging.service';
import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { config } from "../../config";

export class Database {

    private static instance: Database;

    private db!: Db;
    private options?: MongoClientOptions;

    public constructor(private readonly logger?: LoggerService) { }

    public static getInstance = (): Database => Database.instance ??= new Database();

    async setDatabase(): Promise<Db> {
        this.options = {
            retryWrites: true,
            retryReads: true,
            monitorCommands: config.get('env') === 'development',
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        };

        const mongoUrl = this.getMongoDbURL();

        console.log(`[MongoDB] Connecting to: ${mongoUrl}`);

        const connection = await MongoClient.connect(mongoUrl, this.options);
        await connection.db(config.get('db.name')).command({ ping: 1 });

        if (this.logger) {
            this.logger.log('MongoDB connected successfully');
        }

        return connection.db();
    }

    async getDatabase(): Promise<Db> {
        return this.db ??= await this.setDatabase();
    }

    private getMongoDbURL(): string {
        const user = config.get('db.auth.user');
        const password = config.get('db.auth.password');
        const encodedUser = encodeURIComponent(user);
        const encodedPassword = encodeURIComponent(password);

        return (config.get('db.auth.user') && config.get('db.auth.password'))
            ? `mongodb+srv://${encodedUser}:${encodedPassword}@${config.get('db.host')}/${config.get('db.name')}?retryWrites=true&w=majority`
            : `mongodb://${config.get('db.host')}/${config.get('db.name')}`;
    }
}
