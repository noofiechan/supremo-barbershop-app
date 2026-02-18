import { hashPassword } from './lib/auth';

(async () => {
  const hash = await hashPassword('password123');
  console.log('Generated hash:\n', hash);
})();