import BaseCharacter from "./BaseCharacter";

export default class Warrior3 extends BaseCharacter {
    constructor(w,h) {

        super('warrior3', w, h, true, 'png')
        this.idleFrame = 10;
        this.alias = 'Pembunuh Pedo'
        this.aliasPosition = {
            '1': {
                x: 95,
                y: 105
            }, 
            '2': {
                x: 515,
                y: 105
            }
        }
    }
    
    _loadIdle(scene) {
        const key = `${this.name}-idle`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Idle.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Idle.json`)
        return key
    }

    _loadWalk(scene) {
        const key = `${this.name}-walk`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Run.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Run.json`)
        return key
    }

    _loadJump(scene) {
        const key = `${this.name}-jump`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Jump.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Jump.json`)
        return key
    }

    _loadAttack1(scene) {
        const key = `${this.name}-attack1`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Attack1.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Attack1.json`)
        return key
    }

    _loadAttack2(scene) {
        const key = `${this.name}-attack2`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Attack2.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Attack2.json`)
        return key
    }

    _loadAttack3(scene) {
        const key = `${this.name}-attack3`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Attack3.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Attack3.json`)
        return key
    }

    _loadHit(scene) {
        const key = `${this.name}-hit`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Take_hit.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Take_hit.json`)
        return key
    }

    _loadDeath(scene) {
        const key = `${this.name}-death`
        scene.load.atlas(key, `${this.baseUrlAsset}${this.name}/Sprites/Death.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Death.json`)
        return key
    }


    loadAnimation(scene) {
        this.keyWalk = this._loadWalk(scene)
        this.keyAttack1 = this._loadAttack1(scene)
        this.keyAttack2 = this._loadAttack2(scene)
        this.keyAttack3 = this._loadAttack3(scene)
        this.keyIdle = this._loadIdle(scene)
        this.keyJump = this._loadJump(scene)
        this.keyHit = this._loadHit(scene)
        this.keyDeath = this._loadDeath(scene)

    }

    buildAnimation(scene) {
        this.createAnimation(scene, this.keyIdle, this.keyIdle, 'sprite', 8, 0, 5, -1)
        this.createAnimation(scene, this.keyWalk, this.keyWalk, 'sprite', 8, 0, 8, -1)
        this.createAnimation(scene, this.keyJump, this.keyJump, 'sprite', 2, 0, 1, 1)
        this.createAnimation(scene, this.keyAttack1, this.keyAttack1, 'sprite', 4, 0, 12, 0)
        this.createAnimation(scene, this.keyAttack2, this.keyAttack2, 'sprite', 4, 0, 12, 0)
        this.createAnimation(scene, this.keyAttack3, this.keyAttack3, 'sprite', 4, 0, 10, 0)
        this.createAnimation(scene, this.keyHit, this.keyHit, 'sprite', 4, 0, 8, 0)
        this.createAnimation(scene, this.keyDeath, this.keyDeath, 'sprite', 6, 0, 5, 0)


    }

    // override
    attack2(enemy) {
		this.player.setDepth(1)
        const damage = 20
        this.justDownPlayer = true;
        this.player.setVelocityY(-300);
        this.player.anims.play(`${this.name}-attack2`, true).once('animationcomplete', () => {
            this.justDownPlayer = false;
            this.hitEnemy(enemy, 150, 90, damage)
         });
    }

    attack1(enemy) {
		this.player.setDepth(1)
        const damage = 10
        this.justDownPlayer = true;
        this.player.setVelocityY(-220);
        this.player.anims.play(`${this.name}-attack1`, true).once('animationcomplete', () => {
            this.justDownPlayer = false;
            this.hitEnemy(enemy, 100, 90, damage)
         });
    }

}