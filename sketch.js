var bg,bgImg, bgMusic;
var player, shooterImg, shooter_shooting;
var zombie, zombieGroup, zombieAni;
var giantZombie, giantZombieGroup, giantZombieAni, giantZombieHurt;
var fastZombie, fastZombieAni, fastZombieGroup;
var bullet, bulletImg, bulletGroup;
var boss, bossImg, bossGroup, bossHurt;
var scroll, scrollImg;
var freeze, freezeImg, freezeGrey;
var heart3, heart2, heart1, heart;
var explosion, win, lose;
var hurtTimer = 2;
var hearts = 3;
var timer = 0;
var spawning = 0;
var cooldown = 3;
var freezeTimer = 10;
var count = 0;
var score = 0;


function preload(){
  
  shooterImg = loadImage("shooter.png")
  shooter_shooting = loadImage("shooter.png")
  scrollImg = loadImage("scroll.png")
  bossImg = loadAnimation("boss.png")
  freezeImg = loadImage("freeze.png")
  freezeGrey = loadImage("freezeGrey.png")

  heart3 = loadImage("heart_3.png")
  heart2 = loadImage("heart_2.png")
  heart1 = loadImage("heart_1.png")

  zombieAni = loadAnimation("zombie3.png","zombie4.png")
  giantZombieAni = loadImage("GiantZombie.png")
  fastZombieAni = loadImage("FastZombie.png")
  bgImg = loadImage("Background.png")
  bulletImg = loadImage("bullet.png")
  bossHurt = loadImage("bossHurt.png")
  giantZombieHurt = loadImage("GiantZombieHurt.png")

  bgMusic = loadSound("bgMusic.mp3")
  explosion = loadSound("explosion.mp3")
}

function setup() {
  
  createCanvas(windowWidth - 20,windowHeight - 20);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.7
  bgMusic.play()
  
  zombieGroup = new Group();
  giantZombieGroup = new Group();
  fastZombieGroup = new Group();
  bulletGroup = new Group();
  bossGroup = new Group();

  player = createSprite(200, displayHeight-300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  //player.debug = true
  player.setCollider("rectangle",0,0,300,300);

  scroll = createSprite(width - 150, 50)
  scroll.addImage("scroll", scrollImg)
  scroll.scale = 0.2;

  freeze = createSprite(width - 200, height - 70, 20, 20)
  freeze.addImage("freeze", freezeImg);
  freeze.addImage("freezing", freezeGrey);
  freeze.scale = 0.2;

  heart = createSprite(100,50,20,20);
  heart.scale = 0.2;
  heart.addImage("heart",heart1)
  heart.addImage("hearts",heart2)
  heart.addImage("heartss",heart3)
}  

function draw() {
  background(0); 

  if (spawning === 0) {
    createZombies();
    createGiantZombies();
    createFastZombies();
    createBoss();
  }

  if (hearts === 3) {
    heart.changeImage("heartss",heart3)
  }
  if (hearts === 2) {
    heart.changeImage("hearts",heart2)
  }
  if (hearts === 1) {
    heart.changeImage("heart",heart1)
  }

  console.log(hearts)

  if ((zombieGroup.positionX < 20)||(fastZombieGroup.positionX < 20)||(giantZombieGroup.positionX < 20)||(bossGroup.positionX < 20)) {
    hearts -= 1;
    zombieGroup.destroyEach();
    fastZombieGroup.destroyEach();
    giantZombieGroup.destroyEach();
    bossGroup.destroyEach();
  }

  cooldownTimer();
  freezeTimerCooldown();
  TimerCooldown();

  if(bgMusic.isPlaying() != true) {
     bgMusic.play();
  }

  if (mousePressedOver(freeze) && freezeTimer === 0 && timer === 0) {
    timer = 5
    console.log(timer)
    if (timer > 0){
      fastZombieGroup.setVelocityXEach(0)
      zombieGroup.setVelocityXEach(0)
      giantZombieGroup.setVelocityXEach(0)
      bossGroup.setVelocityXEach(0)
      spawning = 1
    }
    if (timer === 0) {
      spawning = 0;
      zombieGroup.setVelocityXEach(-3)
      fastZombieGroup.setVelocityXEach(-5)
      giantZombieGroup.setVelocityXEach(-1)
      bossGroup.setVelocityXEach(-1)
      freezeTimer = 10;
    }
  }

  if(keyDown("UP_ARROW")||touches.length>0){
    player.y = player.y-5
  }
  if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+5
  }

  if(keyWentDown("space") && cooldown === 0){
    shootBullet();
    cooldown = 3;
  }

  if (freezeTimer === 0) {
    freeze.changeImage("freeze", freezeImg)
  }
  else if(freezeTimer > 0) {
    freeze.changeImage("freezing", freezeGrey)
  }

  if(zombieGroup.isTouching(bulletGroup)) {
    for(var i = 0; i < zombieGroup.length; i++) {
      for(var j = 0; j < bulletGroup.length; j++){
        if(zombieGroup[i].isTouching(bulletGroup[j])) {
          zombieGroup[i].destroy();
          bulletGroup[j].destroy();
          score += 10;
          explosion.play()
        }
      }
    }
  }

  if(fastZombieGroup.isTouching(bulletGroup)) {
    for(var i = 0; i < fastZombieGroup.length; i++) {
      for(var j = 0; j < bulletGroup.length; j++){
        if(fastZombieGroup[i].isTouching(bulletGroup[j])) {
          fastZombieGroup[i].destroy();
          bulletGroup[j].destroy();
          score += 20;
          explosion.play()
        }
      }
    }
  }

  if(giantZombieGroup.isTouching(bulletGroup)) {
    for(var i = 0; i < giantZombieGroup.length; i++) {
      for(var j = 0; j < bulletGroup.length; j++){
        if(giantZombieGroup[i].isTouching(bulletGroup[j])) {
          bulletGroup[j].destroy();
          count += 1
          if (count === 3) {
            giantZombieGroup[i].destroy();
            count = 0
            score += 40
          }
        }
      }
    }
  }

  if(bossGroup.isTouching(bulletGroup)) {
    for(var i = 0; i < bossGroup.length; i++) {
      for(var j = 0; j < bulletGroup.length; j++){
        if(bossGroup[i].isTouching(bulletGroup[j])) {
          bulletGroup[j].destroy();
          count += 1;
          boss.addImage("hurting",bossHurt)
          //if(explosion.isPlaying()){
            //giantZombie.changeImage("hurting",bossHurt)
          //}
          //else {
            //giantZombie.changeImage("boss",bossImg)
          //}
          explosion.play()
          if (count === 10) {
            bossGroup[i].destroy();
            count = 0;
            score += 200;
          }
        }
      }
    }
  }

  drawSprites();
  textSize(25)
  fill("black");
  textFont("Times New Roman")
  strokeWeight(3)
  stroke("black")
  text("SCORE:" + score, width - 205, 55)
}

function createZombies() {
  if (frameCount % 80 === 0) {
    var zombie = createSprite(width - 100,Math.round(random(100,height - 100)),50,50)
    zombie.addAnimation("zombie",zombieAni)
    zombie.scale = 0.04;

    zombieGroup.add(zombie);
    zombieGroup.setVelocityXEach(-3)
  }
}

function createFastZombies() {
  if (frameCount % 200 === 0) {
    var fastZombie = createSprite(width - 100,Math.round(random(100,height - 100)),50,50)
    fastZombie.addImage("FastZombie",fastZombieAni)
    fastZombie.scale = 0.2;
    fastZombieGroup.add(fastZombie);
    fastZombieGroup.setVelocityXEach(-5)
  }
}

function createGiantZombies() {
  if (frameCount % 500 === 0) {
    var giantZombie = createSprite(width - 100,Math.round(random(100,height - 100)),50,50)
    giantZombie.addImage("giantZombie",giantZombieAni);
    giantZombie.scale = 0.3;
    giantZombieGroup.add(giantZombie);
    giantZombieGroup.setVelocityXEach(-1)
  }
}

function shootBullet() {
  bullet = createSprite(200,player.y,20,20)
  bullet.addImage("bullet",bulletImg);
  bullet.scale = 0.07;
  bulletGroup.add(bullet)
  bulletGroup.setVelocityXEach(15)
  cooldown = 2
}

function cooldownTimer() {
  if (frameCount % 10 === 0 && cooldown > 0) {
    cooldown -= 1;
  }
}

function freezeTimerCooldown() {
  if (frameCount % 20 === 0 && freezeTimer > 0) {
    freezeTimer --;
  }
}

function TimerCooldown() {
  if (frameCount % 20 === 0 && timer > 0) {
    timer --;
  }
}
function hurt() {
  if (frameCount % 20 === 0 && hurtTimer > 0) {
    hurtTimer --;
  }
}

function createBoss() {
  if(frameCount % 2000 === 0){
    boss = createSprite(width - 100,Math.round(random(100,height - 100)),50,50)
    boss.addImage("boss",bossImg);
    boss.scale = 0.3;
    bossGroup.add(boss)
    bossGroup.setVelocityXEach(-1)
  }
}

