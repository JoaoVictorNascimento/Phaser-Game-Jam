// =============================================================================
// Sprites
// =============================================================================

//
// Hero
//


    var temporaria = Math.floor(Math.random() * 2) + 1;
    console.log(temporaria)


function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    if(temporaria == 1){

        Phaser.Sprite.call(this, game, x, y, 'hero1');

        // anchor
        this.anchor.set(0.5, 0.5);
        // physics properties
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        // animations
        this.animations.add('stop', [0, 1, 2]);
        this.animations.add('left', [3, 4, 5], 10, true); // 8fps looped
        this.animations.add('right', [ 6, 7, 8], 10, true);
        // this.animations.add('jump', [3]);
        // this.animations.add('fall', [4]);
        this.animations.add('die', [5, 6, 5, 6, 5, 6, 5, 6], 10); // 12fps no loop
        // starting animation
    }
    else{
        Phaser.Sprite.call(this, game, x, y, 'hero2');

        // anchor
        this.anchor.set(0.5, 0.5);
        // physics properties
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        // animations
        this.animations.add('stop', [0, 1, 2]);
        this.animations.add('left', [3, 4, 5], 10, true); // 8fps looped
        this.animations.add('right', [ 6, 7, 8], 10, true);
        // this.animations.add('jump', [3]);
        // this.animations.add('fall', [4]);
        this.animations.add('die', [5, 6, 5, 6, 5, 6, 5, 6], 10); // 12fps no loop
        // starting animation
 
    }
    this.animations.play('stop');
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    // guard
    if (this.isFrozen) { return; }

    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};


Hero.prototype.jump = function () {
    const JUMP_SPEED = 400;
    let canJump = this.body.touching.down && this.alive && !this.isFrozen;

    if (canJump || this.isBoosting) {
        this.body.velocity.y = -JUMP_SPEED;
        this.isBoosting = true;
    }

    return canJump;
};

Hero.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Hero.prototype.freeze = function () {
    this.body.enable = false;
    this.isFrozen = true;
};

Hero.prototype.die = function () {
    this.alive = false;
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// returns the animation name that should be playing depending on
// current circumstances
Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // dying
    if (!this.alive) {
        name = 'die';
    }
    // frozen & not dying
    else if (this.isFrozen) {
        name = 'stop';
    }
    // jumping right
    // else if (this.body.velocity.y < 0 && this.body.velocity.x >= 0) {
    //     name = 'right';
    // }
    // else if (this.body.velocity.y < 0 && !this.body.velocity.x >= 0) {
    //     name = 'left';
    // }
    // falling
    else if (this.body.velocity.y >= 0) {
        name = 'right';
    }

    return name;
};

//
// Spider (enemy)
//

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

//
// Darth Vader (enemy)
//

function Darth(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'darth');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('esq', [3, 4], 8, true);
    this.animations.add('dir', [7, 8], 8, true);
    this.animations.add('die', [4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7], 12);
    this.animations.play('dir');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Darth.SPEED;
}

Darth.SPEED = 100;

// inherit from Phaser.Sprite
Darth.prototype = Object.create(Phaser.Sprite.prototype);
Darth.prototype.constructor = Darth;

Darth.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Darth.SPEED; // turn left
    this.animations.play('esq');

    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Darth.SPEED; // turn right
    this.animations.play('dir');

    }
};

Darth.prototype.die = function () {
    this.body.enable = false;

    this.kill();


};
// caminhao
function Caminhao(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'caminhao');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('esq', [0, 1], 1, true);
    this.animations.add('dir', [1, 0], 1, true);
    this.animations.add('die', [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], 12);
    this.animations.play('dir');

    // physic properties
    this.game.physics.enable(this);
    //this.body.collideWorldBounds = true;
    this.body.velocity.x = -Caminhao.SPEED;
}

Caminhao.SPEED = 40;

// inherit from Phaser.Sprite
Caminhao.prototype = Object.create(Phaser.Sprite.prototype);
Caminhao.prototype.constructor = Caminhao;

Caminhao.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Caminhao.SPEED; // turn left
    this.animations.play('esq');

    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Caminhao.SPEED; // turn right
    this.animations.play('dir');

    }
};

Caminhao.prototype.die = function () {
    this.body.enable = false;

    this.kill();


};


// =============================================================================
// Loading state
// =============================================================================

LoadingState = {};

LoadingState.init = function () {
    // keep crispy-looking pixels
    this.game.renderer.renderSession.roundPixels = true;
};

LoadingState.preload = function () {

    this.game.load.json('level:5', 'data/level05.json');
    this.game.load.json('level:0', 'data/level01.json');
    this.game.load.json('level:2', 'data/level00.json');
    this.game.load.json('level:1', 'data/level02.json');
    this.game.load.json('level:4', 'data/level03.json');
    this.game.load.json('level:3', 'data/level04.json');
    this.game.load.json('level:100', 'data/Game_Over.json');

    this.game.load.image('font:numbers', 'images/numbers.png');

    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('icon:life', 'assets/life.png');
    this.game.load.image('background0', 'assets/inicial.jpg');
    this.game.load.image('background1', 'images/background.png');
    this.game.load.image('background2', 'images/background2.png');
    this.game.load.image('background3', 'images/background.png');
    this.game.load.image('background4', 'images/background.png');
    this.game.load.image('background100', 'images/Game_Over.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('stone:8x1', 'assets/stone_8x1.png');
    this.game.load.image('stone:4x1', 'assets/stone_4x1.png');
    this.game.load.image('stone:2x1', 'assets/stone_2x1.png');
    this.game.load.image('stone:1x1', 'assets/stone_1x1.png');
    this.game.load.image('key', 'images/key.png');
    this.game.load.image('bola', 'images/bola.png');
    this.game.load.image('fire', 'assets/fire2.png');

    this.game.load.spritesheet('decoration', 'images/decor.png', 42, 42);
    this.game.load.spritesheet('caminhao', 'images/aa.png', 101, 70);
    // Carregamento do Heroi
    this.game.load.spritesheet('hero1', 'images/hiro1.png', 32, 39);
    this.game.load.spritesheet('hero2', 'images/hiro2.png', 32, 36);


    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    this.game.load.spritesheet('protese', 'images/protese.png', 42, 32);
    this.game.load.spritesheet('darth', 'assets/personagem/darth.png', 32, 36);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    this.game.load.spritesheet('tp', 'images/tp.png', 168, 320);
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.audio('bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);
};

LoadingState.create = function () {
    this.game.state.start('play', true, false, {level: 0});
};

// =============================================================================
// Play state
// =============================================================================

PlayState = {coinPickupCount:0, life: 3};

const LEVEL_COUNT = 5;
const LIFE = 50;

PlayState.init = function (data) {
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.hasKey = false;
    if(data.level !== 100)
        this.level = (data.level || 0) % LEVEL_COUNT;
    else
        this.level=100;
};

PlayState.create = function () {
    // fade in (from black)
    this.camera.flash('#000000');

    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        key: this.game.add.audio('sfx:key'),
        stomp: this.game.add.audio('sfx:stomp'),
        door: this.game.add.audio('sfx:door'),
        tp: this.game.add.audio('sfx:door')
    };
    this.bgm = this.game.add.audio('bgm');
    this.bgm.loopFull();

    // create level entities and decoration
    this.game.add.image(0, 0, 'background'+this.level);
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

    // create UI score boards
    this._createHud();
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();

    // update scoreboards
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.lifeFont.text = `x${this.life}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
};

PlayState.shutdown = function () {
    this.bgm.stop();
};


PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.darths, this.platforms);
    this.game.physics.arcade.collide(this.darths, this.enemyWalls);
    this.game.physics.arcade.collide(this.caminhoes, this.platforms);
    // this.game.physics.arcade.collide(this.caminhoes, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);

    // hero vs coins (pick up)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    // hero vs key (pick up)
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this);
    // hero vs door (end level)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);


    // collision: hero vs Teleport
    for(let i=0;i<this.tp_b.length;i++){
        console.log(i)
        this.game.physics.arcade.overlap(this.hero, this.tp_b[i], (hero,tp)=>{ this._onHeroVsTp_b(hero,tp,i)},
            // ignore if the player is on air
            function (hero) {
                return hero.body.touching.down;
            }, this);

    }


    // collision: hero vs enemies (kill or die)
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.hero, this.darths,
        this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.hero, this.caminhoes,
        this._onHeroVsEnemy, null, this);
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }

    // handle jump
    const JUMP_HOLD = 200; // ms
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.hero.jump();
        if (didJump) { this.sfx.jump.play(); }
    }
    else {
        this.hero.stopJumpBoost();
    }
};

PlayState._onHeroVsKey = function (hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();

    this.coinPickupCount++;
    if(this.coinPickupCount === LIFE){
        this.coinPickupCount -=LIFE
        this.life+=1
    }
};

PlayState._onHeroVsEnemy = function (hero, enemy) {
    // the hero can kill enemies when is falling (after a jump, or a fall)
    if (hero.body.velocity.y > 0) {
        enemy.die();
        hero.bounce();
        this.sfx.stomp.play();
    }
    else { // game over -> play dying animation and restart the game
        this.life-=1;
        if(this.life === 0){
            this.level = 100
        }
        hero.die();
        this.sfx.stomp.play();
        hero.events.onKilled.addOnce(function () {
            this.game.state.restart(true, false, {level: this.level});
        }, this);

        // NOTE: bug in phaser in which it modifies 'touching' when
        // checking for overlaps. This undoes that change so spiders don't
        // 'bounce' agains the hero
        enemy.body.touching = enemy.body.wasTouching;
    }
};
PlayState._onHeroVsTp_b = function (hero, tp, i) {
    // 'open' the door by changing its graphic and playing a sfx
    hero.reset(this.tp_a[i].worldPosition.x,this.tp_a[i].worldPosition.y-30)
};

PlayState._onHeroVsDoor = function (hero, door) {
    // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
    this.sfx.door.play();

    // play 'enter door' animation and change to the next level when it ends
    hero.freeze();
    this.game.add.tween(hero)
        .to({x: this.door.x, alpha: 0}, 500, null, true)
        .onComplete.addOnce(this._goToNextLevel, this);
};

PlayState._goToNextLevel = function () {
    this.camera.fade('#000000');
    this.camera.onFadeComplete.addOnce(function () {
        // change to next level
        this.game.state.restart(true, false, {
            level: this.level + 1
        });
    }, this);
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.darths = this.game.add.group();
    this.caminhoes = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn hero and enemies

    this._spawnCharacters({hero: data.hero, spiders: data.spiders?data.spiders:[], darths: data.darths?data.darths:[],
    caminhoes: data.caminhoes?data.caminhoes:[]});

    // spawn level decoration
    data.decoration.forEach(function (deco) {
        this.bgDecoration.add(
            this.game.add.image(deco.x, deco.y, 'decoration', deco.frame));
    }, this);

    // spawn platforms
    data.platforms.forEach(this._spawnPlatform, this);
    if(data.elevador)
        data.elevador.forEach(this._spawnElevador, this);
    if(data.fire)
        data.fire.forEach(this._spawnFire, this);

    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);
            this.tp_a=[];
        this.tp_b=[];
    if (data.tp){

        for(let i=0;i< data.tp.length;i++){
            this._spawnTp(data.tp[i],i)
        }
    }
    if(data.key)
        this._spawnKey(data.key.x, data.key.y);
    if(data.door)
    this._spawnDoor(data.door.x, data.door.y);

    // enable gravity
    let GRAVITY = 0
    if(temporaria == 2){
        GRAVITY = 890;
    }else{
        GRAVITY = 25200;
    }
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

    // spawn darths
    data.darths.forEach(function (darth) {
        let sprite = new Darth(this.game, darth.x, darth.y);
        this.darths.add(sprite);
    }, this);

    // spawn caminhao
    data.caminhoes.forEach(function (caminhao) {
        let sprite = new Caminhao(this.game, caminhao.x, caminhao.y);
        this.caminhoes.add(sprite);
    }, this);

    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    // spawn invisible walls at each side, only detectable by enemies
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnElevador = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.gravity.y = -25205;
    sprite.body.immovable = true;

    // spawn invisible walls at each side, only detectable by enemies
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnFire = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // physics for platform sprites
    this.game.physics.enable(sprite);
    if(temporaria == 2){
        sprite.body.gravity.y = -1000;
    }else{
        sprite.body.gravity.y = -25205;
    }
    sprite.body.immovable = true;

    // spawn invisible walls at each side, only detectable by enemies
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    // physics (so we can detect overlap with the hero)
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    // animations
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    // enable physics to detect collisions, so the hero can pick the key up
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;

    // add a small 'up & down' animation via a tween
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};
PlayState._spawnTp = function (tp, i) {
    this.tp_a.push({});
    this.tp_a[i] = this.bgDecoration.create(tp.out.x, tp.out.y, 'tp');

    this.tp_a[i].scale.setTo(.3,.3);

    this.tp_a[i].anchor.setTo(0.5, 1);
    this.game.physics.enable(this.tp_a[i]);
    this.tp_a[i].body.allowGravity = false;

    this.tp_a[i].animations.add('tp_a'+i, [0,1], 10, true);
    this.tp_a[i].play('tp_a'+i);


    this.tp_b.push({});
    this.tp_b[i] = this.bgDecoration.create(tp.in.x, tp.in.y, 'tp');
    this.tp_b[i].anchor.setTo(0.5, 1);
    this.game.physics.enable(this.tp_b[i]);
    this.tp_b[i].body.allowGravity = false;

    this.tp_b[i].animations.add('tp_b'+i, [2,3], 10, true);
    this.tp_b[i].play('tp_b'+i);

    this.tp_b[i].scale.setTo(.3,.3)

};

PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);
    this.lifeFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);

    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let lifeIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:life');
    lifeIcon.scale.setTo(.7,.7)
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
    this.hud.position.set(10, 10);

    let lifeScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.lifeFont);
    lifeScoreImg.anchor.set(0, 0.5);

    this.hudlife = this.game.add.group()
    this.hudlife.add(lifeIcon)
    this.hudlife.add(lifeScoreImg)
    this.hudlife.position.set(130, 10);

};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.add('loading', LoadingState);
    game.state.start('loading');
};
