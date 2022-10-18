import { Events } from 'phaser'
import eventsCenter from './eventCenter';

export function onLikeEventListener(like) {
    console.log(like);
    eventsCenter.emit('like', like);
}

export function onCommentEventListener(comment) {
    console.log(comment);
    eventsCenter.emit('comment', comment);
}



