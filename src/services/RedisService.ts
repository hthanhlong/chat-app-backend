import { RedisClientType, createClient } from 'redis';
import { redisUrl } from '../config';

class RedisService {
  public client: RedisClientType;

  constructor(url: string) {
    this.client = createClient({ url });
    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err: Error | any) => {
      console.error('Error connecting to Redis:', err);
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }
}

const instance = new RedisService(redisUrl);

process.on('SIGINT', () => {
  instance.client.quit();
});

export default instance;
