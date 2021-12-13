import { Scene } from 'phaser'

let platforms;
let player;
let level;
let isWinner;
let keyESC;
let style1 = { font: "bold 32px Arial", fill: "#000"};
let style2 = { font: "bold 24px Arial", fill: "#222"};

export default class PauseScene extends Scene {

  constructor () {
    super({ key: 'PauseScene' })
  }

  create() {
    isWinner = false;
    level = 1;
    this.setUpInputKeys();
    this.setUpBackground();
    this.setUpPlayer();
    this.setUpIdleAnimation();
  }

  init(data){
    this.token = data.token;
  }
  
  update(){
    if(keyESC.isDown){
        this.scene.resume('PlayScene');
        this.scene.stop();
      }
  }

  setUpInputKeys() {
    keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  setUpBackground() {
    this.add.image(400, 300, 'sky')
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.add.text(265, 250, 'Paused Game', style1);
    this.add.text(240, 310, 'Press ESC to continue', style2);
  }

  setUpPlayer() {
    player = this.physics.add.sprite(100, 450, 'brawler');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
  }

  setUpIdleAnimation() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('brawler', { frames: [5, 6, 7, 8] }),
      frameRate: 8,
      repeat: -1
    });

    player.anims.play('idle', true);
  }
}