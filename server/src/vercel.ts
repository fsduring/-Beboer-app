import { config } from 'dotenv';
config();

import app from './app';

export default function handler(req: Parameters<typeof app>[0], res: Parameters<typeof app>[1]) {
  return app(req, res);
}
