import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { CommentLike } from '../entities/comment-like.entity.js';
import { Comment } from '../entities/comment.entity.js';

@EventSubscriber()
export class CommentLikeSubscriber implements EntitySubscriberInterface<CommentLike> {
  listenTo() {
    return CommentLike;
  }

  async afterInsert(event: InsertEvent<CommentLike>) {
    const commentRepo = event.manager.getRepository(Comment);
    await commentRepo.increment({ id: event.entity.commentId }, 'likeCount', 1);
  }

  async afterRemove(event: RemoveEvent<CommentLike>) {
    const target = event.entity || event.databaseEntity;
    if (!target) return;

    const commentRepo = event.manager.getRepository(Comment);
    await commentRepo.decrement({ id: target.commentId }, 'likeCount', 1);
  }
}
