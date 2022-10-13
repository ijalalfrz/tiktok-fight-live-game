
export default class BaseCharacter {
	constructor(name, width, height, isSprite, ext) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.isSprite = isSprite;
		this.ext = ext;
		this.baseUrlAsset = 'characters/';
		this.keyWalk = null;
		this.keyAttack1 = null;
		this.keyAttack2 = null;
		this.keyAttack3 = null;
		this.keyIdle = null;
		this.keyJump = null;
		this.keyHit = null;
		this.keyDeath = null;
		this.justDownPlayer = false;
        this.player = null;
        this.health = null;
        this.originHealth = null;
		this.isDead = false;
        this.platform = null;
	}

	setHealth(health) {
		this.health = health;
		this.originHealth = health;
	}

	loadAssets(scene) {
		if (this.isSprite) {
			scene.load.atlas(this.name, `${this.baseUrlAsset}${this.name}/Sprites/Idle.${this.ext}`,`${this.baseUrlAsset}${this.name}/Sprites/Idle.json`)
			
		}
	}

	hasAnimation(anim) {
		switch(anim) {
			case 'walk':
				return this.keyWalk ? true : false;
			case 'attack1':
				return this.keyAttack1 ? true : false;
			case 'attack2':
				return this.keyAttack2 ? true : false;
			case 'attack3':
				return this.keyAttack3 ? true : false;
			case 'walk':
				return this.keyWalk ? true : false;

		}
	}

	createAnimation(scene, key, sprite, prefix, end, zeroPad, frameRate, repeat, start = 1) {
		scene.anims.create({
			key: key,
			frames: scene.anims.generateFrameNames(sprite, { prefix, start, end, zeroPad }),
			frameRate: frameRate,
			repeat: repeat
		});
	}


    addPlayerToScene(scene, x, y, flip=false) {
        this.player = scene.physics.add.sprite(x, y, this.name);
        this.player.setSize(this.width,this.height)
        this.player.setScale(2.5,2.5)
        this.player.setCollideWorldBounds(true);
        if (flip) {
            this.player.flipX = true
        }

    }

    addPlatforms(scene, platform) {
        scene.physics.add.collider(this.player, platform);
        this.platform = platform;
    }

    touchPlatform() {
        this.player.y >= this.platform.y - 5
    }

    standing() {
        this.player.anims.play(`${this.name}-idle`, true);
    }

    moveLeft() {
        this.player.anims.play(`${this.name}-walk`, true);
        this.player.flipX = true
        this.player.setVelocityX(-160);
    }

    moveRight() {
        this.player.anims.play(`${this.name}-walk`, true);
        this.player.flipX = false
        this.player.setVelocityX(160);
    }

    stop() {
        this.player.setVelocityX(0);
    }

    jump() {
        this.player.anims.play(`${this.name}-jump`, true);
        this.player.setVelocityY(-590);
    }

    attack1(enemy) {
		this.player.setDepth(1)
        const damage = 10
        this.justDownPlayer = true;
        this.player.anims.play(`${this.name}-attack1`, true).once('animationcomplete', () => {
            this.justDownPlayer = false;
            this.hitEnemy(enemy, 100, 90, damage)
         });
    }

    attack2(enemy) {
		this.player.setDepth(1)
        const damage = 20
        this.justDownPlayer = true;
        this.player.anims.play(`${this.name}-attack2`, true).once('animationcomplete', () => {
            this.justDownPlayer = false;
            this.hitEnemy(enemy, 150, 90, damage)
         });
    }

    attack3(enemy) {
		this.player.setDepth(1)

        const damage = 30
        this.justDownPlayer = true;
        this.player.anims.play(`${this.name}-attack3`, true).once('animationcomplete', () => {
            this.justDownPlayer = false;
            this.hitEnemy(enemy, 150, 90, damage)

        });
    }

    death() {
		if (!this.isDead) {
			this.isDead = true
			this.justDownPlayer = true;
			this.player.anims.play(`${this.name}-death`, true).once('animationcomplete', () => {
				// this.justDownPlayer = false;
			});
			this.player.setVelocityX(300);
			this.player.setVelocityY(-700);
		}
    }

    takeHit() {
        this.justDownPlayer = true;
        this.player.anims.play(`${this.name}-hit`, true).once('animationcomplete', () => {
            this.justDownPlayer = false;
        });
    }

    hitEnemy(enemy, deltaX, deltaY, damage) {
		console.log(Math.abs(this.player.x - enemy.character.player.x))
        if (Math.abs(this.player.x - enemy.character.player.x) < deltaX && Math.abs(this.player.y - enemy.character.player.y) <= deltaY && this.health > 0) {
			enemy.character.takeHit()
            // hitEnemy = true;
            if ((enemy.character.health - damage) >= 0)
                enemy.character.health -= damage;
            else
                enemy.character.health = 0;

            if (enemy.playerNum == 2) {
                enemy.healthBar.scaleX = (enemy.character.health / enemy.character.originHealth)
            } else {
                enemy.healthBar.scaleX = - (enemy.character.health / enemy.character.originHealth)

                // enemy.healthBar.scaleX = - enemy.health / 100
            }
            // setEnemyValuebar(healthBarEnemy, lifeEnemy);
            // scorePlayer += damagePoints;
            // scoreTextPlayer.setText('SCORE: ' + scorePlayer);
            // kickSound.play();
        }
    }


} 