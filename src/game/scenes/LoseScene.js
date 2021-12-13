import { Scene } from 'phaser'
import axios from 'axios';

let platforms;
let player;
let score1;
let sadText;
let level;
let isWinner;
let youLoseSound;

export default class LoseScene extends Scene {

  constructor () {
    super({ key: 'LoseScene' })
  }
    
  create() {
    isWinner = false;
    level = 1;
    score1 = 0;
    youLoseSound = this.sound.add('youLoseSound', { volume: 0.2 });
    youLoseSound.play();
    this.setUpBackground();
    this.setUpPlayer();
    this.setUpDeathAnimation();
    this.addTimeEvent();
  }

  init(data){
    this.token = data.token;
  }

  addTimeEvent() {
    this.time.addEvent({
      delay: 5000,                // ms
      callback: this.putvideogame,
      //args: [],
      callbackScope: this,
      loop: false
    });
  }

  async putvideogame() {
    await axios.put(this.parse('https://estimapi.herokuapp.com/api/data/game_sessions/token/%s', this.token), {
      "gseScore": score1,
      "gseLevel": level,
      "gseIsWinner": isWinner
    }).then(res => { console.log(res.status) })
  }

  parse(str) {
    let args = [].slice.call(arguments, 1),
      i = 0;

    return str.replace(/%s/g, () => args[i++]);
  }

  setUpBackground() {
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    sadText = this.add.text(400 - 16, 300, 'Game Over', { font: "bold 48px Arial", fill: '#f00' })
              .setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
  }
  
  setUpPlayer() {
    player = this.physics.add.sprite(150, 900, 'brawler');
    player.scale = 3;
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
  }

  setUpDeathAnimation() {
    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('brawler', { frames: [35, 36, 37] }),
      frameRate: 5,
    });
    player.anims.play('die', true);
  }
}