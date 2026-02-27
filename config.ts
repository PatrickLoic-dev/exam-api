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
  s3: {
    endpoint: {
      doc: 'S3-compatible storage endpoint URL',
      format: String,
      default: '',
      env: 'S3_ENDPOINT',
    },
    accessKey: {
      doc: 'S3 access key',
      format: String,
      default: '',
      env: 'S3_ACCESS_KEY',
    },
    secretKey: {
      doc: 'S3 secret key',
      format: String,
      default: '',
      env: 'S3_SECRET_KEY',
    },
    bucket: {
      doc: 'S3 bucket name',
      format: String,
      default: 'heyama',
      env: 'S3_BUCKET',
    },
  },
});

const env = config.get('env');
config.loadFile(`./src/environments/${env}.json`);
config.validate({ allowed: 'strict' });