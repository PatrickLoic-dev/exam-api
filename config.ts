import convict from 'convict';

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['development', 'production', 'staging'],
    default: 'development',
    env: 'NODE_ENV',
  },
    ip:{
    doc: 'The IP address to bind.',
    format: String,
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  host:{
    doc: 'Application host',
    format: '*', // Accepts any string
    default: 'localhost',
    env: 'HOST',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  db: {
    host : {
        doc: 'Database host',
        format: '*',
        default: '127.0.0.1:27017',
        env: 'DB_MONGO_HOST',
    },
    name : {
        doc: 'Database name',
        format: '*',
        default: '',
        env: 'DB_NAME',
    },
    auth: {
        user:{
            doc: 'Database user',
            format: String,
            default: '',
            env: 'DB_USERNAME',
        }, 
        password: {
            doc: 'Database password',
            format: String,
            default: '',
            env: 'DB_PASSWORD',
        },
    },

  },
  baseUrl :{
    doc: 'Base URL for the application',
    format: String,
    default: 'http://localhost:3000',
    env: 'BASE_URL',
    arg: 'base-url',
  },
  basePath: {
    doc: 'Base path for the application',
    format: String,
    default: '',
  },
  enableConsoleLogging : {
    doc: 'Enable or disable console logging',
    format: Boolean,
    default: true,
    env: 'ENABLE_CONSOLE_LOGGING',
  },
  enableFileLogging  : {
    doc : 'Enable or disable file logging',
    format : Boolean,
    default : true,
    env : 'ENABLE_FILE_LOGGING',
  },
  r2: {
    accountId: {
      doc: 'Cloudflare R2 account ID',
      format: String,
      default: '',
      env: 'R2_ACCOUNT_ID',
    },
    accessKey: {
      doc: 'R2 access key',
      format: String,
      default: '',
      env: 'R2_ACCESS_KEY',
    },
    secretKey: {
      doc: 'R2 secret key',
      format: String,
      default: '',
      env: 'R2_SECRET_KEY',
    },
    bucket: {
      doc: 'R2 bucket name',
      format: String,
      default: 'heyama',
      env: 'R2_BUCKET',
    },
    publicUrl: {
      doc: 'R2 public URL',
      format: String,
      default: '',
      env: 'R2_PUBLIC_URL',
    },
  },
});

const env = config.get('env');
config.loadFile(`./src/environments/${env}.json`);
config.validate({ allowed: 'strict' });