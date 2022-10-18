import { Scene } from 'phaser'
import background from '@/game/assets/character/menu-character.png'
import warrior1Inactive from '@/game/assets/character/warrior1-inactive.png'
import warrior1active from '@/game/assets/character/warrior1-active.png'
import hunt1Inactive from '@/game/assets/character/hunt1-inactive.png'
import hunt1active from '@/game/assets/character/hunt1-active.png'
import king1Inactive from '@/game/assets/character/king1-inactive.png'
import king1active from '@/game/assets/character/king1-active.png'
import warrior3Inactive from '@/game/assets/character/warrior3-inactive.png'
import warrior3active from '@/game/assets/character/warrior3-active.png'
import martial1Inactive from '@/game/assets/character/martial1-inactive.png'
import martial1active from '@/game/assets/character/martial1-active.png'
export default class CharacterScene extends Scene {

    constructor () {
      super({ key: 'CharacterScene' })
      this.remainingTime = 3;
      this.countdown = null;
      this.players = new Map([
        ['user1', 'p1'],
        ['user2', 'p1'],
        ['user3', 'p2'],
        ['user4', 'p2'],
        ['user5', 'p2'],
      ]);
      this.character = {};

      this.characterName = ['warrior1', 'hunt1', 'king1', 'martial1', 'warrior3']
      this.playerHasVote = new Map()
      this.player1Vote = new Map([
        ['/1', 0],
        ['/2', 0],
        ['/3', 0],
        ['/4', 0],
        ['/5', 0],
      ])
      this.player2Vote = new Map([
        ['/1', 0],
        ['/2', 0],
        ['/3', 0],
        ['/4', 0],
        ['/5', 0],
      ])

      this.p1Char = null;
      this.p2Char = null;

      this.voteMessage = []
      this.message = [
        {
            comment: "/1",
            userId: "6881163914983801857",
            uniqueId: "user1",
            nickname: "wahyu",
            isSubscriber: true,
        },{
            comment: "/1",
            userId: "6881163914983801857",
            uniqueId: "user2",
            nickname: "wahyu",
            isSubscriber: true,
        },{
            comment: "/2",
            userId: "6881163914983801857",
            uniqueId: "user3",
            nickname: "wahyu",
            isSubscriber: true,
        },{
            comment: "/3",
            userId: "6881163914983801857",
            uniqueId: "user4",
            nickname: "wahyu",
            isSubscriber: true,
        },{
            comment: "/3",
            userId: "6881163914983801857",
            uniqueId: "user5",
            nickname: "wahyu",
            isSubscriber: true,
        }
      ];
    }

    async preload () {
        this.load.image('menu-bg', background);
        this.load.image('warrior1-inactive', warrior1Inactive);
        this.load.image('warrior1-active', warrior1active);
        this.load.image('hunt1-inactive', hunt1Inactive);
        this.load.image('hunt1-active', hunt1active);
        this.load.image('king1-inactive', king1Inactive);
        this.load.image('king1-active', king1active);
        this.load.image('martial1-inactive', martial1Inactive);
        this.load.image('martial1-active', martial1active);
        this.load.image('warrior3-inactive', warrior3Inactive);
        this.load.image('warrior3-active', warrior3active);

    }

    update () {
        if (this.voteMessage.length > 0) {
            let vote = this.voteMessage.pop()
            this.votePlayer(vote)
            this.getVotedPlayer()
        }
    }

    votePlayer(vote) {
        if (vote.comment.charAt(0) == '/') {
            if (vote.isSubscriber && this.players.has(vote.uniqueId)) {
                let playerNumber = this.players.get(vote.uniqueId);
                if (playerNumber == 'p1') {
                    if (this.player1Vote.has(vote.comment)) {
                        let accum = this.player1Vote.get(vote.comment)
                        this.player1Vote.set(vote.comment, accum+1)
                    }
                }

                if (playerNumber == 'p2') {
                    if (this.player2Vote.has(vote.comment)) {
                        let accum = this.player2Vote.get(vote.comment)
                        this.player2Vote.set(vote.comment, accum+1)
                    }
                }
                
            }
        }
    }
    
    getVotedPlayer() {
    
        let sortedPlayer1Vote = new Map([...this.player1Vote].sort((a, b) => b[1] - a[1]));
        let sortedPlayer2Vote = new Map([...this.player2Vote].sort((a, b) => b[1] - a[1]));
        let [firstPlaceP1] = sortedPlayer1Vote.keys()
        let [firstPlaceP2] = sortedPlayer2Vote.keys()
        this.resetVote()
        firstPlaceP1 = firstPlaceP1.replace('/','')
        firstPlaceP2 = firstPlaceP2.replace('/','')
        this.p1Char = this.characterName[parseInt(firstPlaceP1)-1];
        this.p2Char = this.characterName[parseInt(firstPlaceP2)-1];
        
        this.character[`c${firstPlaceP1}`].setTexture(`${this.p1Char}-active`)
        this.character[`c${firstPlaceP2}`].setTexture(`${this.p2Char}-active`)


    }

    resetVote () {
        for(let i=1; i<=5; i++) {
            this.character[`c${i}`].setTexture(`${this.characterName[i-1]}-inactive`)
        }
    }

    create () {

        let timedEvent = this.time.addEvent({ delay: 1000, callback: this.onCountDown, callbackScope: this, loop: true })
        
        let background = this.add.image(400, 300, `menu-bg`)
        this.character['c1'] = this.add.image(200, 340, `warrior1-active`)
        this.character['c2'] = this.add.image(335, 340, 'hunt1-active')
        this.character['c3'] = this.add.image(470, 340, 'king1-inactive')
        this.character['c4'] = this.add.image(605, 340, 'martial1-inactive')
        this.character['c5'] = this.add.image(400, 495, 'warrior3-inactive')

        this.countdown = this.add.text(20, 20, this.remainingTime, { font: "bold 34px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);

        
        this.add.text(150, 275, '1', { font: "bold 24px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
        this.add.text(285, 275, '2', { font: "bold 24px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
        this.add.text(420, 275, '3', { font: "bold 24px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
        this.add.text(555, 275, '4', { font: "bold 24px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);
        this.add.text(350, 430, '5', { font: "bold 24px Arial", fill: "#fff"}).setShadow(2, 2, 'rgba(0,0,0,0.8)', 1);

        const scale = 1.5
        this.character['c1'].setScale(scale)
        this.character['c2'].setScale(scale)
        this.character['c3'].setScale(scale)
        this.character['c4'].setScale(scale)
        this.character['c5'].setScale(scale)
    }


    onCountDown ()
    {
        //experiment
        if (this.message.length > 0) {
            this.voteMessage.push(this.message.pop())
        }

        if (this.remainingTime <= 0) {

            this.scene.start('PlayScene', {
                players: this.players,
                character: {
                    p1: this.p1Char,
                    p2: this.p2Char
                }
            });
        } else {
            this.remainingTime -= 1; // One second
        }
        this.countdown.setText(this.remainingTime);
    }

}