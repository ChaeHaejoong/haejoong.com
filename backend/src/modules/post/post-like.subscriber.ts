import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { PostLike } from './entities/post-like.entity';
import { Post } from './entities/post.entity';

@EventSubscriber()
export class PostLikeSubscriber implements EntitySubscriberInterface<PostLike> {
  listenTo() {
    return PostLike;
  }

  async afterInsert(event: InsertEvent<PostLike>) {
    const postRepo = event.manager.getRepository(Post);
    await postRepo.increment({ id: event.entity.postId }, 'likes', 1);
  }

  async afterRemove(event: RemoveEvent<PostLike>) {
    const target = event.entity || event.databaseEntity;
    if (!target) return;

    const postRepo = event.manager.getRepository(Post);
    await postRepo.decrement({ id: target.postId }, 'likes', 1);
  }
}
