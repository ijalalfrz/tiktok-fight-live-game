import { Events } from 'phaser'
import eventsCenter from './eventCenter';

export function onLikeEventListener(like) {
    console.log(like);
    eventsCenter.emit('like', like);
}

