import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import type Redis from 'ioredis';
import { REDIS } from '../../infrastructure/redis/redis.module';
import { Post } from './entities/post.entity';

// Redis 키
const BUFFER_KEY = 'post:views:buffer'; // Hash { postId: pendingCount }
const viewedKey = (postId: string, identity: string) =>
  `post:viewed:${postId}:${identity}`;

// 같은 주체가 동일 게시글을 중복 카운트하지 않을 유효 시간 (24시간)
const VIEWED_TTL_SEC = 60 * 60 * 24;

@Injectable()
export class ViewCountService {
  private readonly logger = new Logger(ViewCountService.name);

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * 게시글 조회 시 호출. 중복이 아닐 때만 Redis 버퍼에 +1.
   * - identity = sha256(ip) 로 고정 (원본 IP 미저장)
   */
  async record(postId: string, _userId: string | undefined, ip: string) {
    const identity = createHash('sha256').update(ip).digest('hex');
    const key = viewedKey(postId, identity);

    // SET NX: 키가 없을 때만 세팅 (= 아직 조회하지 않은 경우)
    const isNew = await this.redis.set(key, '1', 'EX', VIEWED_TTL_SEC, 'NX');
    if (isNew === 'OK') {
      await this.redis.hincrby(BUFFER_KEY, postId, 1);
    }
  }

  /**
   * Redis 버퍼에 아직 flush되지 않은 조회수를 반환.
   */
  async getBufferedCount(postId: string): Promise<number> {
    const value = await this.redis.hget(BUFFER_KEY, postId);
    return value ? parseInt(value, 10) : 0;
  }

  /**
   * 버퍼 전체를 { postId: count } 맵으로 반환. 목록 API에서 일괄 합산에 사용.
   */
  async getAllBufferedCounts(): Promise<Record<string, number>> {
    const raw = await this.redis.hgetall(BUFFER_KEY);
    if (!raw) return {};
    return Object.fromEntries(
      Object.entries(raw).map(([postId, count]) => [
        postId,
        parseInt(count, 10),
      ]),
    );
  }

  /**
   * 매 1분마다 Redis 버퍼를 DB에 반영하고 초기화.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async flush() {
    const buffer = await this.redis.hgetall(BUFFER_KEY);
    if (!buffer || Object.keys(buffer).length === 0) return;

    const entries = Object.entries(buffer).map(([postId, count]) => ({
      postId,
      count: parseInt(count, 10),
    }));

    // 버퍼를 먼저 초기화해 sync 중 유실 방지 (race condition 최소화)
    await this.redis.del(BUFFER_KEY);

    await Promise.all(
      entries.map(({ postId, count }) =>
        this.postRepository.increment({ id: postId }, 'views', count),
      ),
    );

    this.logger.debug(
      `Flushed view counts for ${entries.length} post(s) to DB`,
    );
  }
}
