import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import authConfig from './auth.config';
import emailConfig from './email.config';
import * as Joi from 'joi';

// Esquema de validación para variables de entorno críticas
const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  
  // Supabase (obligatorias en producción)
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
  
  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  
  // Email (opcional en desarrollo)
  SMTP_HOST: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  SMTP_USER: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  SMTP_PASS: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
});

export const configurationModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [
    appConfig,
    databaseConfig,
    authConfig,
    emailConfig,
  ],
  validationSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
});

export {
  appConfig,
  databaseConfig,
  authConfig,
  emailConfig,
};
