import { Scene } from 'phaser'
import axios from 'axios';
import Player from '../player/Player';
import eventsCenter from '../../tiktok/eventCenter';

const playerWidth = 40;
const playerHeight = 94;
let platforms;
let player;
let player2;
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
let keyB;
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
let p1Idle;
let p1Run;
let p1Jump;
let p1Attack;
let p1Slide;
let setPlayerValuebar = (bar, percentage) => bar.scaleX = - percentage / 100;
let setEnemyValuebar = (bar, percentage) => bar.scaleX = percentage / 100;

export default class PlayScene extends Scene {

  constructor () {
    super({ key: 'PlayScene' })
    this.player1 = null;
    this.player2 = null;
    this.eventQueue = [];
  }
  async preload() {
    const characters = ['hunt1', 'king1', 'warrior1', 'warrior3', 'martial1']
    const randomP1 = this.randomInteger(0, characters.length - 1)
    const cP1 = characters[randomP1]
    this.removeArray(cP1, characters)
    const randomP2 = this.randomInteger(0, characters.length - 1)
    const cP2 = characters[randomP2]
    this.player1 = new Player(this,1, 'warrior3', 2000, 70, 70)
    this.player2 = new Player(this,2, cP2, 50, 70, 70)  

  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  removeArray(item, array) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onLikeEventListener(event){
    console.log('fired')
    const item = {
      type: 'like', 
      data: event,
    }
    this.eventQueue.push(item);
  }

  create () {
    // event listener list
    eventsCenter.on('like', this.onLikeEventListener, this);

    // set up
    this.setUpSounds();
    this.initializeStatistics();
    this.setUpBackground();
    this.setUpHealthBars();
    this.setUpTexts();
    this.setUpPlatforms();
    // this.setUpPlayer();
    // this.setUpPlayer2();
    
    this.setUpInputKeys();
    // this.setUpEnemy();
    // this.setUpAnimationsPlayer();
    // this.setUpAnimationsEnemy();
    // this.addTimeEvent();
    this.player1.buildCharacterAnimation(this)
    this.player1.setUpHealthBar(this, 95, 80)
    this.player1.character.addPlayerToScene(this, 300, 50)
    this.player1.character.addPlatforms(this, platforms)
    this.player1.showAliasText(this, 95, 105)
    

    this.player2.buildCharacterAnimation(this)
    this.player2.setUpHealthBar(this, 425, 80)
    this.player2.character.addPlayerToScene(this, 500, 50, true)
    this.player2.character.addPlatforms(this, platforms)
    this.player2.showAliasText(this, 540, 105)



  }

  init(data){
    this.token = data.token;
  }

  update() {
    let eventItem = this.eventQueue.pop();

    if (eventItem && eventItem.type == 'like') {
      this.player1.character.attack1(this.player2)
    }

    this.updatePlayersMovement(keyW, keyA, keyD, keyB, keyN, keyM);
    // this.updatePlayersFlip(player2, enemy);
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

  updatePlayersMovement(up, left, right, attack1, attack2, attack3) {

    if (this.player1.avaliableHitJustDown(attack1)) {
      this.player1.character.attack1(this.player2)
    }
    if (this.player1.avaliableHitJustDown(attack2)) {
      this.player1.character.attack2(this.player2)
    }
    if (this.player1.avaliableHitJustDown(attack3)) {
      this.player1.character.attack3(this.player2)
    }

    if (this.player1.avaliableSideIsDown(right) && this.player1.avaliableJumpIsDown(up)) {
      this.player1.character.moveRight()
      this.player1.character.jump()
    } else if (this.player1.avaliableSideIsDown(left) && this.player1.avaliableJumpIsDown(up)) {
      this.player1.character.moveLeft()
      this.player1.character.jump()
    } else if (this.player1.avaliableSideIsDown(left)) {
      this.player1.character.moveLeft()
    } else if (this.player1.avaliableSideIsDown(right)) {
      this.player1.character.moveRight()
    } else if (this.player1.avaliableJumpIsDown(up)) {
      this.player1.character.jump()
    } else if (this.player1.isPlayerDown()) {
      this.player1.character.standing()
      this.player1.character.stop()
      // if (this.player1.needToMoveToEnemy(this.player2)) {
      //   this.player1.character.moveRight()
      // } else {
      //   // this.player1.playerArrive()
      // }
    } 
    
  
    if (this.player2.isPlayerDown()) {
      this.player2.character.standing()
      this.stop(this.player2.character.player)
    } 

    if (this.player2.isPlayerDead()) {
      this.player2.character.death()
    }


  }

  setUpPlayer() {
    player2 = this.physics.add.sprite(300, 100, 'warrior1');
    // player2.getBottomCenter()
    // player2.setSize(50, 100);
    // player2.show
    player2.scaleX=0.4;
    player2.scaleY=0.4;
    player2.setCollideWorldBounds(true);
    this.physics.add.collider(player2, platforms);
  }

  setUpPlayer2() {
    // player = this.physics.add.sprite(100, 100, 'p1');
    // // player.setSize(player.width, player.height);
    // player.scaleX=1;
    // player.scaleY=1;
    // player.setCollideWorldBounds(true);
    // this.physics.add.collider(player, platforms);
  }

  setUpEnemy() {
    enemy = this.physics.add.sprite(600, 800, 'warrior1');
    enemy.setSize(playerWidth, playerHeight);
    enemy.setOffset(15, 5);
    enemy.scaleX=2;
    enemy.scaleY=2;
    enemy.setCollideWorldBounds(true);
    this.physics.add.collider(enemy, platforms);
  }

  setUpAnimationsPlayer() {
    this.createAnimation('walk', 'brawler', [ 0, 1, 2, 3, 4, 5 ], 8, 0);
    this.createAnimation('idle', 'brawler', [ 6, 7, 8, 9, 10 ], 6, 0);
    this.createAnimationFromImages('newIdle', 'p1', p1Idle, 20)
    this.createAnimationFromImages('newWalk', 'p1', p1Run, 20)
    this.createAnimationFromImages('newPunch', 'p1', p1Attack, 20)
    this.createAnimationFromImages('newKick', 'p1', p1Slide, 20)



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
        if (Math.abs(player2.x - enemy.x) < deltaX && Math.abs(player2.y - enemy.y) <= deltaY && !hitEnemy && (lifePlayer > 0)) {
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
        if (Math.abs(player2.x - enemy.x) < deltaX && Math.abs(player2.y - enemy.y) <= deltaY && !hitPlayer && (lifeEnemy > 0)) {
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
    // music.play();
    fightSound = this.sound.add('fightSound', { volume: 0.2 });
    fightSound.play();
    kickSound = this.sound.add('kickSound', { volume: 0.2 });
    punchSound = this.sound.add('punchSound', { volume: 0.21 });
  }

  setUpBackground() {
    const bg = this.randomInteger(1,2)
    let background = this.add.image(400, 300, `background${bg}`)
    if (bg == 2) {
      background.scaleX = 2;
      background.scaleY = 1.6
    }
  }

  setUpHealthBars() {
    this.makeBar(95, 80, 610, 25, 0xff2222);

    // let kentFace = this.add.image(46, 70, 'kentFace');
    // kentFace.scale = 0.19;
    // let quenxiroFace = this.add.image(753, 70, 'quenxiroFace');
    // quenxiroFace.scale = 0.19;
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
    // scoreTextPlayer = this.add.text(100, 30, 'SCORE: 0', { font: "bold 24px Arial", fill: "#ea7"}).setShadow(2, 2, 'rgba(0,0,70,1)', 1);
  }

  setUpPlatforms() {
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 578, 'ground').setScale(2).refreshBody();
    platforms.setVisible(false);
  }

  setUpInputKeys() {
    keyW = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyM = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.M);
    keyN = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.N);
    keyB = this.addInputKey(Phaser.Input.Keyboard.KeyCodes.B);

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
      // await axios.put(this.parse('https://estimapi.herokuapp.com/api/data/game_sessions/token/%s', this.token), {
      //   "gseScore": scorePlayer,
      //   "gseLevel": level,
      //   "gseIsWinner": isWinner
      // }).then(res => { console.log(res.status) });
    }
  }

  parse(str) {
    let args = [].slice.call(arguments, 1),
      i = 0;

    return str.replace(/%s/g, () => args[i++]);
  }

  createAnimationFromImages(_key, _sprite, _framesArray, _frameRate) {
    console.log(_key)
    this.anims.create({
      key: _key,
      frames: _framesArray,
      frameRate: _frameRate,
      repeat: false
  });
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
      // this.doAnim(player, 'idle');
      this.doAnim(player2, 'newIdle');

      this.stop(player2)
      // this.stop(player);
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
    return _jump.isDown && player2.body.touching.down && !justDownPlayer && (lifeEnemy > 0) && (lifePlayer > 0);
  }

  isAnyPlayerDown() {
    return (!justDownPlayer || !justDownEnemy) && (lifeEnemy > 0) && (lifePlayer > 0);
  }

  isAnyPlayerDead() {
    return ((lifeEnemy <= 0) || (lifePlayer <= 0)) && !loadedEndAnimations;
  }

}