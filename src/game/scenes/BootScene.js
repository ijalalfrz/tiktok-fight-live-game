import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
import background from '@/game/assets/bg1.png'
import background2 from '@/game/assets/bg2.png'

import ground from '@/game/assets/platform.png'
import brawler from '@/game/assets/ken.png'
import brawler2 from '@/game/assets/character3.png'
import axios from 'axios';
import theme from '@/game/assets/GuileTheme.ogg'
import fightSound from '@/game/assets/Fight.mp3'
import youLoseSound from '@/game/assets/YouLose.mp3'
import youWinSound from '@/game/assets/YouWin.mp3'
import kickSound from '@/game/assets/KickSound.mp3'
import punchSound from '@/game/assets/PunchSound.mp3'
import kentFace from '@/game/assets/KentFace.png'
import quenxiroFace from '@/game/assets/QuenxiroFace.png'

let event = 0;
let style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
let text;  //  The Text is positioned at 0, 100

export default class BootScene extends Scene {

  constructor () {
    super({ key: 'BootScene' })
  }

  async preload () {
    // this.load.path = "../assets/"
    
    this.load.image('sky', sky);
    this.load.image('background1', background);
    this.load.image('background2', background2);

    this.load.image('ground', ground);
    this.load.audio('guile', theme);
    this.load.audio('fightSound', fightSound);
    this.load.audio('youLoseSound', youLoseSound);
    this.load.audio('youWinSound', youWinSound);
    this.load.audio('kickSound', kickSound);
    this.load.audio('punchSound', punchSound);
    this.load.spritesheet('brawler', brawler, { frameWidth: 67, frameHeight: 113 });
    this.load.spritesheet('brawler2', brawler2, { frameWidth: 67, frameHeight: 113 });
 
    this.load.image('kentFace', kentFace);
    this.load.image('quenxiroFace', quenxiroFace);
    this.load.image('p1','p1/Idle__000.png')
    this.load.image('p2','p2/Idle__000.png')

    // this.load.atlas('warrior1', `characters/warrior1/Sprites/Idle.png`,`characters/warrior1/Sprites/Idle.json`)

    for(var i=0;i<10;i++){
      this.load.image(`p1Idle-${i}`,`p1/Idle__00${i}.png`)
      this.load.image(`p1Run-${i}`,`p1/Run__00${i}.png`)
      this.load.image(`p1Jump-${i}`,`p1/Jump__00${i}.png`)
      this.load.image(`p1Attack-${i}`,`p1/Attack__00${i}.png`)
      this.load.image(`p1Slide-${i}`,`p1/Slide__00${i}.png`)




      this.load.image(`p2Idle-${i}`,`p2/Idle__00${i}.png`)

    }
  }

  async create() {
    console.log(new URL(location.href).searchParams.get('token'));
    this.setUpImage();
    //this.addTimeEvent();
    // this.scene.start('PlayScene');
    this.scene.start('CharacterScene');

  }

  addTimeEvent() {
    this.time.addEvent({
      delay: 2000,                // ms
      callback: this.getToken,
      //args: [],
      callbackScope: this,
      repeat: 4
    });
  }

  async getToken() {
    this.scene.start('PlayScene');

    // let newToken = new URL(location.href).searchParams.get('token');

    // await axios.put(this.parse('https://estimapi.herokuapp.com/api/data/game_sessions/token/%s', newToken), {
    //   "gseScore": 0,
    //   "gseLevel": 0,
    //   "gseIsWinner": false
    // })
    //   .then(res => {
    //     this.status = res.status;
    //     event = event + 1;
    //   })
    //   .catch((err) => console.log(err))
    //   console.log(this.status)
    //   console.log(this.token)
    //   console.log(event)
    //   if (this.status == 200 && event<=4){
    //     this.scene.start('PlayScene', { token: newToken });
    //   } else {
    //     text = this.add.text(0, 0, "HTTP Request Failed", style);
    //     text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    //   }
  }

  parse(str) {
    let args = [].slice.call(arguments, 1),
      i = 0;

    return str.replace(/%s/g, () => args[i++]);
  }

  setUpImage() {
    this.add.image(400, 300, 'sky')
    text = this.add.text(300, 300, "Loading...", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  }
}
