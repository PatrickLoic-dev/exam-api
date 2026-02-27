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
        const authOptions = (config.get('db.auth.user') && config.get('db.auth.password'))
            ? {
                auth: {
                    username: config.get('db.auth.user'),
                    password: config.get('db.auth.password')
                }
            }
            : {};

        this.options = {
            ...authOptions,
            retryWrites: true,
            retryReads: true,
            monitorCommands: config.get('env') === 'development',
        };

        const mongoUrl = this.getMongoDbURL();

        const connection = await MongoClient.connect(mongoUrl, this.options);

        if (this.logger) {
            this.logger.log('MongoDB connected successfully');
        }

        return connection.db(config.get('db.name'));
    }

    async getDatabase(): Promise<Db> {
        return this.db ??= await this.setDatabase();
    }

    private getMongoDbURL(): string {
        const isProduction = config.get('env') === 'production';

        if (isProduction) {
            return `mongodb://${config.get('db.auth.user')}:${config.get('db.auth.password')}@${config.get('db.host')}`;
        }

        return (config.get('db.auth.user') && config.get('db.auth.password'))
            ? `mongodb://${config.get('db.auth.user')}:${config.get('db.auth.password')}@${config.get('db.host')}/${config.get('db.name')}?retryWrites=true&w=majority`
            : `mongodb://${config.get('db.host')}/${config.get('db.name')}`;
    }
}
