import CharacterFactory from "./CharacterFactory";

export default class Player {
    constructor(scene, number, character, health, w, h) {
        this.characterName = character;
        this.character = new CharacterFactory(this.characterName,w,h).create();
        this.character.loadAssets(scene)
        this.character.loadAnimation(scene)
        this.character.setHealth(health);
        this.width = w;
        this.height = h;
        this.healthBar = null;
        this.playerNum = number;
        this.arrive = false;
    }

    showAliasText(scene, x, y) {

        scene.add.text(this.character.aliasPosition[this.playerNum].x, this.character.aliasPosition[this.playerNum].y, this.character.alias, { font: "bold 24px Arial", fill: "#ea7"}).setShadow(2, 2, 'rgba(0,0,70,1)', 1);
    } 

    setUpHealthBar(scene, x, y) {
        this.healthBar = this.makeBar(scene,x, y, 280, 25, 0xeeee44);
    }

    setHealthValue(bar, percentage){
        bar.scaleX = - percentage / 100;
    } 

    makeBar(scene, x, y, xSize, ySize, color) {
        let bar = scene.add.graphics();  //draw the bar
        bar.fillStyle(color, 1);  //color the bar
        bar.fillRect(0, 0, xSize, ySize);  //fill the bar with a rectangle
        //position the bar
        bar.x = x;
        bar.y = y;
        return bar;
    }
    

    buildCharacterAnimation(scene) {
        this.character.buildAnimation(scene)
    }

    avaliableHitJustDown(hitBtn) {
        return Phaser.Input.Keyboard.JustDown(hitBtn) && !this.character.justDownPlayer && (this.character.health > 0);
    }

    avaliableSideIsDown(sideBtn) {
        return sideBtn.isDown && !this.character.justDownPlayer && (this.character.health > 0);
    }

    avaliableJumpIsDown(jumpBtn) {
        return jumpBtn.isDown && this.character.player.body.touching.down && !this.character.justDownPlayer && (this.character.health > 0);
    }
    isPlayerDown() {
        return (!this.character.justDownPlayer) && (this.character.health > 0);
    }
    
    isPlayerDead() {
        return (this.character.health <= 0)
    }

    playerArrive() {
        this.arrive = true
    }
    
    needToMoveToEnemy(enemy) {
        let enemyChar = enemy.character
        return !this.arrive && enemyChar.player.x - (enemyChar.width/1.5) > this.character.player.x && this.character.player.y >= 455
    }
}