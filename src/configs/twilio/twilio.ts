import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('TWILIO_ACCOUNT_SID et TWILIO_AUTH_TOKEN doivent être définis dans les variables d\'environnement');
}

export const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

