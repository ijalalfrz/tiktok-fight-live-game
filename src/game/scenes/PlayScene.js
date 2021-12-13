import { Scene } from 'phaser'
import axios from 'axios';

const playerWidth = 40;
const playerHeight = 94;
let platforms;
let player;
let enemy;
let hitPlayer;
let hitEnemy;
let scorePlayer;
let scoreTextPlayer;
let keyA;
let keyD;
let keyW;
let keyM;
let keyN;
let keyESC;
let isWinner;
let level;
let healthBarPlayer;
let healthBarEnemy;
let lifePlayer;
let lifeEnemy;
let music;
let fightSound;
let kickSound;
let punchSound;
let justDownPlayer;
let justDownEnemy;
let goingToMoveFromScene;
let loadedEndAnimations;
let setPlayerValuebar = (bar, percentage) => bar.scaleX = - percentage / 100;
let setEnemyValuebar = (bar, percentage) => bar.scaleX = percentage / 100;

export default class PlayScene extends Scene {

  constructor () {
    super({ key: 'PlayScene' })
  }

  create () {
    this.setUpSounds();
    this.initializeStatistics();
    this.setUpBackground();
    this.setUpHealthBars();
    this.setUpTexts();
    this.setUpPlatforms();
    this.setUpPlayer();
    this.setUpInputKeys();
    this.setUpEnemy();
    this.setUpAnimationsPlayer();
    this.setUpAnimationsEnemy();
    this.addTimeEvent();
  }

  init(data){
    this.token = data.token;
  }

  update() {
    this.updatePlayersMovement(keyW, keyA, keyD, keyM, keyN);
    this.updatePlayersFlip(player, enemy);
    this.updateSceneNavigation();
  }

  initializeStatistics() {
    scorePlayer = 0;
    lifePlayer = 100;
    lifeEnemy = 100;
    justDownPlayer = false;
    justDownEnemy = false;
    isWinner = false;
    level = 1;
    goingToMoveFromScene = false;
    loadedEndAnimations = false;
  }

  updateSceneNavigation() {
    music.resume();
    if (lifeEnemy <= 0 && !goingToMoveFromScene) {
      goingToMoveFromScene = true;
      setTimeout(() => {
        music.stop();
        this.scene.start('WinScene', { token: this.token, score1: this.scorePlayer });
      }, 1500);
    }
    if (lifePlayer <= 0 && !goingToMoveFromScene) {
      goingToMoveFromScene = true;
      setTimeout(() => {
        music.stop();
        this.scene.start('LoseScene', { token: this.token});
      }, 1500);
    }
    if (keyESC.isDown) {
      music.pause();
      this.scene.launch('PauseScene');
      this.scene.pause();
    }
  }

  updatePlayersMovement(up, left, right, jumpkick, punch) {
    if (this.avaliableHitJustDown(jumpkick)) {
      justDownPlayer = true;
      this.doAnim(player, 'jumpkick');
      this.stopIfWalking(player);
      this.setPlayerJumpkickTimeout();
      setTimeout(() => {
        if (this.enemyCanDoAnim()) {
          justDownEnemy = true;
          this.doAnim(enemy, 'jumpkick2');
          this.stopIfWalking(enemy);
          this.setEnemyJumpkickTimeout();
        }
      }, 500);
    }
    else if (this.avaliableHitJustDown(punch)) {
      justDownPlayer = true;
      this.doAnim(player, 'punch');
      this.stopIfWalking(player);
      this.setPlayerPunchTimeout();
      setTimeout(() => {
        if (this.enemyCanDoAnim()) {
          justDownEnemy = true;
          this.doAnim(enemy, 'punch2');
          this.stopIfWalking(enemy);
          this.setEnemyPunchTimeout();
        }
      }, 500);
    }
    else if (this.avaliableJumpIsDown(up)) {
      this.jump(player);
      setTimeout(() => {
        if (this.enemyCanDoAnim()) {
          this.jump(enemy);
        }
      }, 500);
    } 
    else if (this.avaliableSideIsDown(left)) {
      this.doAnim(player, 'walk');
      this.moveLeft(player);
      setTimeout(() => {
        if (this.enemyCanDoAnim()) {
          this.doAnim(enemy, 'walk2');
          this.moveRight(enemy);
        }
      }, 500);
    } 
    else if (this.avaliableSideIsDown(right)) {
      this.doAnim(player, 'walk');
      this.moveRight(player);
      setTimeout(() => {
        if (this.enemyCanDoAnim()) {
          this.doAnim(enemy, 'walk2');
          this.moveLeft(enemy);
        }
      }, 500);
    } 
    else if (this.isAnyPlayerDown()) {
      this.doIdlePlayers();
    }
    else if (this.isAnyPlayerDead()) {
      loadedEndAnimations = true;
      this.stop(player);
      this.stop(enemy);
      if (lifePlayer <= 0) {
        this.doAnim(player, 'die');
        this.doAnim(enemy, 'win2');
      } else {
        this.doAnim(player, 'win');
        this.doAnim(enemy, 'die2');
      }
    }
  }

  setUpPlayer() {
    player = this.physics.add.sprite(100, 800, 'brawler');
    player.setSize(playerWidth, playerHeight);
    player.scaleX=2;
    player.scaleY=2;
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
  }

  setUpEnemy() {
    enemy = this.physics.add.sprite(600, 800, 'brawler2');
    enemy.setSize(playerWidth, playerHeight);
    enemy.setOffset(15, 5);
    enemy.scaleX=2;
    enemy.scaleY=2;
    enemy.setCollideWorldBounds(true);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);
  }

  setUpAnimationsPlayer() {
    this.createAnimation('walk', 'brawler', [ 0, 1, 2, 3, 4, 5 ], 8, 0);
    this.createAnimation('idle', 'brawler', [ 6, 7, 8, 9, 10 ], 6, 0);
    this.createAnimation('jumpkick', 'brawler', [ 14, 15, 16, 17, 16, 15, 14 ], 12, 0);
    this.createAnimation('punch', 'brawler', [ 12, 13, 12 ], 7, 0);
    this.createAnimation('win', 'brawler', [ 21, 22 ], 2);
    this.createAnimation('die', 'brawler', [ 18, 19, 20 ], 3);
  }

  setUpAnimationsEnemy() {
    this.createAnimation('walk2', 'brawler2', [ 1, 2, 3, 4 ], 6, 0);
    this.createAnimation('idle2', 'brawler2', [ 0, 6, 15, 6 ], 4, 0);
    this.createAnimation('jumpkick2', 'brawler2', [ 10, 11, 12 ], 6, 0);
    this.createAnimation('punch2', 'brawler2', [ 5, 7, 5 ], 7, 0);
    this.createAnimation('win2', 'brawler2', [ 15, 16, 17, 18, 19 ], 4);
    this.createAnimation('die2', 'brawler2', [ 20, 21, 22, 23 ], 4);
  }

  setPlayerJumpkickTimeout() {
    hitEnemy = false;
    this.setPlayerScoreCalcTimeout([150, 200, 250, 300, 330, 360], 9, 114, 138);
    setTimeout(() => {
      justDownPlayer = false
    }, 450);
  }

  setEnemyJumpkickTimeout() {
    hitPlayer = false;
    this.setEnemyScoreCalcTimeout([150, 200, 250, 300, 330, 360], 5, 114, 138);
    setTimeout(() => {
      justDownEnemy = false
    }, 450);
  }

  setPlayerPunchTimeout() {
    hitEnemy = false;
    this.setPlayerScoreCalcTimeout([70, 110, 150, 200, 245, 290, 330], 7, 113, 90);
    setTimeout(() => {
      justDownPlayer = false
    }, 390);
  }

  setEnemyPunchTimeout() {
    hitPlayer = false;
    this.setEnemyScoreCalcTimeout([70, 110, 150, 200, 245, 290, 330], 4, 113, 90);
    setTimeout(() => {
      justDownEnemy = false
    }, 390);
  }

  setPlayerScoreCalcTimeout(msList, damagePoints, deltaX, deltaY) {
    for (let ms of msList) {
      setTimeout(() => {
        if (Math.abs(player.x - enemy.x) < deltaX && Math.abs(player.y - enemy.y) <= deltaY && !hitEnemy && (lifePlayer > 0)) {
          hitEnemy = true;
          if ((lifeEnemy - damagePoints) >= 0)
            lifeEnemy -= damagePoints;
          else
            lifeEnemy = 0;
          setEnemyValuebar(healthBarEnemy, lifeEnemy);
          scorePlayer += damagePoints;
          scoreTextPlayer.setText('SCORE: ' + scorePlayer);
          kickSound.play();
        }
      }, ms);
    }
  }

  setEnemyScoreCalcTimeout(msList, damagePoints, deltaX, deltaY) { 
    for (let ms of msList) {
      setTimeout(() => {
        if (Math.abs(player.x - enemy.x) < deltaX && Math.abs(player.y - enemy.y) <= deltaY && !hitPlayer && (lifeEnemy > 0)) {
          hitPlayer = true;
          if ((lifePlayer - damagePoints) >= 0)
            lifePlayer -= damagePoints;
          else
            lifePlayer = 0;
          setPlayerValuebar(healthBarPlayer, lifePlayer);
          punchSound.play();
        }
      }, ms);
    }
  }

  updatePlayersFlip(p1, p2) {
    this.animateFlip(p1, p2);
    this.animateFlip(p2, p1);
  }

  animateFlip(player1, player2) {
    if (player1.x < player2.x) {
      player1.flipX = false;
    } else {
      player1.flipX = true;
    }
  }

  setUpSounds() {
    music = this.sound.add('guile', { volume: 0.2, loop: true });
    music.play();
    fightSound = this.sound.add('fightSound', { volume: 0.2 });
    fightSound.play();
    kickSound = this.sound.add('kickSound', { volume: 0.2 });
    punchSound = this.sound.add('punchSound', { volume: 0.21 });
  }

  setUpBackground() {
    let background = this.add.image(400, 300, 'background')
    background.scaleX = 2;
    background.scaleY = 1.6
  }

  setUpHealthBars() {
    this.makeBar(95, 80, 610, 25, 0xff2222);

    let kentFace = this.add.image(46, 70, 'kentFace');
    kentFace.scale = 0.19;
    let quenxiroFace = this.add.image(753, 70, 'quenxiroFace');
    quenxiroFace.scale = 0.19;
    healthBarPlayer = this.makeBar(375, 80, 280, 25, 0xeeee44);
    setPlayerValuebar(healthBarPlayer, lifePlayer);
    healthBarEnemy = this.makeBar(425, 80, 280, 25, 0xeeee44);
    setEnemyValuebar(healthBarEnemy, lifeEnemy);
  }

  makeBar(x, y, xSize, ySize, color) {
    let bar = this.add.graphics();  //draw the bar
    bar.fillStyle(color, 1);  //color the bar
    bar.fillRect(0, 0, xSize, ySize);  //fill the bar with a rectangle
    //position the bar
    bar.x = x;
    bar.y = y;
    return bar;
  }

  setUpTexts() {
    this.add.text(375, 77, 'K.O', { font: "bold 28px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
    this.add.text(95, 105, 'KENT', { font: "bold 24px Arial", fill: "#ea7"}).setShadow(2, 2, 'rgba(0,0,70,1)', 1);
    this.add.text(572, 105, 'QUENXIRO', { font: "bold 24px Arial", fill: '#ea7'}).setShadow(2, 2, 'rgba(0,0,70,1)', 1);
    scoreTextPlayer = this.add.text(100, 30, 'SCORE: 0', { font: "bold 24px Arial", fill: "#ea7"}).setShadow(2, 2, 'rgba(0,0,70,1)', 1);
  }

  setUpPlatforms() {
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(3).refreshBody();
    platforms.setVisible(false);
  }

  setUpInputKeys() {
    keyW = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyM = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.M);
    keyN = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.N);
    keyESC = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  addTimeEvent() {
    this.time.addEvent({
      delay: 5000,                // ms
      callback: this.putvideogame,
      callbackScope: this,
      loop: true  });
  }

  async putvideogame() {
    if (!loadedEndAnimations) {
      await axios.put(this.parse('https://estimapi.herokuapp.com/api/data/game_sessions/token/%s', this.token), {
        "gseScore": scorePlayer,
        "gseLevel": level,
        "gseIsWinner": isWinner
      }).then(res => { console.log(res.status) });
    }
  }

  parse(str) {
    let args = [].slice.call(arguments, 1),
      i = 0;

    return str.replace(/%s/g, () => args[i++]);
  }

  createAnimation(_key, _sprite, _framesArray, _frameRate) {
    this.anims.create({
      key: _key,
      frames: this.anims.generateFrameNumbers(_sprite, { frames: _framesArray }),
      frameRate: _frameRate
  });
  }

  createAnimation(_key, _sprite, _framesArray, _frameRate, _repeat) {
    this.anims.create({
      key: _key,
      frames: this.anims.generateFrameNumbers(_sprite, { frames: _framesArray }),
      frameRate: _frameRate,
      repeat: _repeat
  });
  }

  createAnimation(_key, _sprite, _framesArray, _frameRate, _repeat, _repeatDelay) {
    this.anims.create({
      key: _key,
      frames: this.anims.generateFrameNumbers(_sprite, { frames: _framesArray }),
      frameRate: _frameRate,
      repeat: _repeat,
      repeatDelay: _repeatDelay 
  });
  }

  addInputKey(_KEY) {
    return this.input.keyboard.addKey(_KEY);
  }

  moveLeft(_player) {
    _player.setVelocityX(-160);
  }

  moveRight(_player) {
    _player.setVelocityX(160);
  }

  stop(_player) {
    _player.setVelocityX(0);
  }

  jump(_player) {
    _player.setVelocityY(-590);
  }

  doAnim(_player, _key) {
    if(typeof _player !== "undefined") _player.anims.play(_key, true);
  }

  stopIfWalking(_player) {
    if (_player.body.touching.down) this.stop(_player);
  }

  enemyCanDoAnim() {
    return lifeEnemy > 0 && lifePlayer > 0 && !justDownEnemy;
  }

  doIdlePlayers() {
    if (!justDownPlayer) {
      this.doAnim(player, 'idle');
      this.stop(player);
    }
    if (!justDownEnemy) {
      this.doAnim(enemy, 'idle2');
      this.stop(enemy);
    }
  }

  avaliableHitJustDown(_hit) {
    return Phaser.Input.Keyboard.JustDown(_hit) && !justDownPlayer && (lifeEnemy > 0) && (lifePlayer > 0);
  }

  avaliableSideIsDown(_side) {
    return _side.isDown && !justDownPlayer && (lifeEnemy > 0) && (lifePlayer > 0);
  }

  avaliableJumpIsDown(_jump) {
    return _jump.isDown && player.body.touching.down && !justDownPlayer && (lifeEnemy > 0) && (lifePlayer > 0);
  }

  isAnyPlayerDown() {
    return (!justDownPlayer || !justDownEnemy) && (lifeEnemy > 0) && (lifePlayer > 0);
  }

  isAnyPlayerDead() {
    return ((lifeEnemy <= 0) || (lifePlayer <= 0)) && !loadedEndAnimations;
  }

}