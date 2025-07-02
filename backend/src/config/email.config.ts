import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Panel EMB',
    address: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER,
  },
  templates: {
    welcome: 'welcome',
    resetPassword: 'reset-password',
    invoice: 'invoice',
  },
}));
