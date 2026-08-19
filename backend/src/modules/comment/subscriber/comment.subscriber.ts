import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity.js';
import { Post } from '../../post/entities/post.entity.js';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>) {
    const postRepo = event.manager.getRepository(Post);
    await postRepo.increment({ id: event.entity.postId }, 'commentCount', 1);
  }

  async afterSoftRemove(event: SoftRemoveEvent<Comment>) {
    const target = event.entity || event.databaseEntity;
    if (!target) return;

    const postRepo = event.manager.getRepository(Post);
    await postRepo.decrement({ id: target.postId }, 'commentCount', 1);
  }
}
