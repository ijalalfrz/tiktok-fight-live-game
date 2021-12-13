import { Scene } from 'phaser'
import axios from 'axios';
let platforms;
let player;
let score1;
let style1 = { font: "bold 48px Arial", fill: '#fd0' };
let style2 = { font: "bold 28px Arial", fill: "#fff"};
let level;
let isWinner;
let keyE;
let youWinSound;

export default class WinScene extends Scene {

  constructor () {
    super({ key: 'WinScene' })
  }

  create() {
    isWinner = true;
    level = 1;
    score1 = 100;
    youWinSound = this.sound.add('youWinSound', { volume: 0.2 });
    youWinSound.play();
    this.setUpBackground();
    this.setUpPlayer();
    this.setUpWinAnimation();
    this.addTimeEvent();
    this.setUpInputKeys();
  }

  init(data){
    this.token = data.token;
    this.score1 = data.score1;
  }

  update() {
    if (keyE.isDown) {
      this.scene.start('PlayScene')
      this.scene.stop();
    }
  }

  addTimeEvent() {
    this.time.addEvent({
      delay: 5000,                // ms
      callback: this.putvideogame,
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
    this.add.image(400, 300, 'sky')
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(4).refreshBody();
    this.add.text(300, 250, 'You Win!', style1).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
    this.add.text(300, 315, 'Prepare for the next battle!', style2).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
    this.add.text(300, 345, 'Press E to continue', style2).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
  }

  setUpPlayer() {
    player = this.physics.add.sprite(150, 900, 'brawler');
    player.scale=3;
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
  }

  setUpWinAnimation() {
    this.anims.create({
      key: 'win',
      frames: this.anims.generateFrameNumbers('brawler', { frames: [ 30, 31 ] }),
      frameRate: 3,
      repeat:-1
    });
    player.anims.play('win', true);
  }

  setUpInputKeys() {
    keyE = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.E);
  }
  
  addInputKey(_KEY) {
    return this.input.keyboard.addKey(_KEY);
  }  
}
