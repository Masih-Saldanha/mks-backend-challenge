import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisUseService {
  private readonly redisClient;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
