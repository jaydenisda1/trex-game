
localStorage["HighestScore"]=0;

var bird,birdsImg,birdGroup;
var die,jump,checkpoint;
var gameover,gameoverImg;
var restart,restartImg;
var trex, trex_running, trex_collided,trexDown;
var ground, invisibleGround, groundImage;
var clouds, cloudsImg;
var obsticles;
var obsticle1Img,
  obsticle2Img,
  obsticle3Img,
  obsticle4Img,
  obsticle5Img,
  obsticle6Img;
var trexSTART;
var START = 2;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = START;

var cloudsGroup;
var obsticaleGroup;
function preload() {
  birdsImg = loadImage("bird1.png");
  trexDown = loadAnimation("trex_down.png");
  trexSTART = loadAnimation("trex1.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
   gameoverImg = loadImage("gameOver-1.png");
  restartImg = loadImage("restart.png");
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudsImg = loadImage("cloud.png");
  groundImage = loadImage("ground2.png");
  obsticle1Img = loadImage("obstacle1.png");
  obsticle2Img = loadImage("obstacle2.png");
  obsticle3Img = loadImage("obstacle3.png");
  obsticle4Img = loadImage("obstacle4.png");
  obsticle5Img = loadImage("obstacle5.png");
  obsticle6Img = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);

  gameover = createSprite(300,80,30,30);
  gameover.addImage(gameoverImg);
  gameover.visible=false;
  restart = createSprite(300,120,10,10);
  restart.addImage(restartImg);
  restart.scale=0.5
  restart.visible=false;
  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("stand",trexSTART);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.addAnimation("down",trexDown);
  trex.scale = 0.5;

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //creating invisible ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //generate random numbers
  var rand = Math.round(random(1, 100));
  console.log(rand);
  
  cloudsGroup = new Group();
  obsticaleGroup = new Group();
  birdGroup = new Group();
  trex.setCollider("circle",0,0,40);
  trex.debug=true;
}

function draw() {
  //set background color
  background("white");
if(localStorage["HighestScore"]<score){
  localStorage["HighestScore"]=score;
}
  if(gameState===START){
    ground.velocityX=0;
    obsticaleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    if(keyDown("space")||keyDown("UP_ARROW")){
    gameState=PLAY;
  }

  }
  
  if (gameState === PLAY) {
    trex.changeAnimation("running",trex_running);
    ground.velocityX = -4-score/50;
      if (keyDown("space") && trex.y >= 160||keyDown("UP_ARROW")&& trex.y >=160) {
      trex.velocityY = -12;
      jump.play();
    }
    trex.velocityY = trex.velocityY + 0.6;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    spawnClouds();
    spawnObsticles();
    
    score =score+ Math.round(getFrameRate() / 60);
    if (score%100===0&&score>0){
      checkpoint.play();
    }
    if (keyDown("DOWN_ARROW")){
      trex.changeAnimation("down",trexDown);
    }
    if (obsticaleGroup.isTouching(trex)||birdGroup.isTouching(trex)) {
      gameState = END;
        die.play(); }
      birds();
  }   
  else if (gameState === END) {
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obsticaleGroup.setVelocityXEach(0);
    obsticaleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);  
    birdGroup.setVelocityXEach(0);
    birdGroup.setLifetimeEach(-1);
    restart.visible=true;
    gameover.visible=true;
    trex.changeAnimation("collided",trex_collided); 
  }

  if(mousePressedOver(restart)){
    reset();
  }
  trex.collide(invisibleGround);
  drawSprites();
  text("Score:" + score, 490, 50);
  text("HI Score:"+localStorage["HighestScore"],350,50);

}

//function to spawn the clouds
function spawnClouds() {
  if (frameCount % 100 === 0) {
    clouds = createSprite(600, 80, 50, 10);
    clouds.velocityX = -2;
    clouds.addImage(cloudsImg);
    clouds.y = Math.round(random(100, 50));
    clouds.scale = 0.6;
    clouds.lifetime = 310;
    trex.depth = clouds.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(clouds);
  }
}
function spawnObsticles() {
  if (frameCount % 100 === 0) {
    obsticles = createSprite(600, 170, 10, 30);
    obsticles.velocityX = -4-score/50;
    obsticles.collide(invisibleGround);
    obsticles.scale = 0.5;
    obsticles.lifetime = 210;
    obsticles.x = Math.round(random(450, 580));
    var randomNumber = Math.round(random(1, 6));
    switch (randomNumber) {
      case 1:
        obsticles.addImage(obsticle1Img);
        break;
      case 2:
        obsticles.addImage(obsticle2Img);
        break;
      case 3:
        obsticles.addImage(obsticle3Img);
        break;
      case 4:
        obsticles.addImage(obsticle4Img);
        break;
      case 5:
        obsticles.addImage(obsticle5Img);
        break;
      case 6:
        obsticles.addImage(obsticle6Img);
        break;
      default:
        break;
        
    }
 obsticaleGroup.add(obsticles); }
}
function reset(){
  gameState=PLAY;
gameover.visible=false;
restart.visible=false;
cloudsGroup.destroyEach();
 obsticaleGroup.destroyEach();
birdGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
score=0;

}
function birds(){
if (frameCount % 250 === 0) {
    bird = createSprite(600, 80, 50, 10);
    bird.velocityX = -2;
    bird.addImage(birdsImg);
    bird.y = Math.round(random(100, 50));
    bird.scale = 0.6;
    bird.lifetime = 310;
    trex.depth = bird.depth;
    trex.depth = bird.depth + 1;
    birdGroup.add(bird);
  
}
}