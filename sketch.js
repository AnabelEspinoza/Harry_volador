const PLAY=1;
const END=0;
const PAUSE=2;
var gameState= PAUSE;
var back, backImg;
var castilloImg, castilloGroup;
var player, playerLeft, playerRight, dibujito;
var dementorImg, dementorGroup;
var snitchImg, snitchGroup;
var points=0;




function preload(){
  backImg = loadImage("images/fondo1.jpg");
  playerLeft= loadAnimation("images/harry2.png");
  playerRight= loadAnimation("images/harry1.png");
  dementorImg= loadImage("images/dementor.png");
  snitchImg= loadImage("images/snitch1.png");
  castilloImg= loadImage("images/castillo2.png");
}


function setup() {
  createCanvas(400, 800);
  
  //Fondo
  back= createSprite(225,100,20,20);
  back.addImage(backImg);
  
  //imagen inicio
  dibujito= createSprite(400,-50);
  dibujito.addAnimation("left", playerLeft);
  dibujito.scale=0.2;
  
   
  //Juagador
  player= createSprite(200, 400);
  player.addAnimation("left", playerLeft);
  player.addAnimation("right", playerRight);
  player.scale=0.2;
  player.setCollider('circle',0,0,150);
  player.visible=false;
   
   
  //Crear Grupos
  castilloGroup= new Group();
  dementorGroup= new Group();
  snitchGroup= new Group();
  
}

  

function draw() {
  background(220);
  drawSprites();
  
  //Puntiación
  textSize(20);
  fill("#7F0909");
  stroke("#FFC500")
  text("Puntos: " + points, 20, 30);
  
  //Inicio del Juego
  if(gameState === PAUSE){
    textSize(25);
    fill("#7F0909");
    stroke("#FFC500")
    text("Presiona ENTER",100, 200);
    text("para comenzar ",110, 230);
    dibujito.velocityX=-1;
    dibujito.velocityY=2;
    if(dibujito.x === 215){
      dibujito.velocityX=0;
      dibujito.velocityY=0; 
    }
  }
  
  if ((keyDown("enter") || touches.length > 0) && gameState === PAUSE ){
    gameState=PLAY;
    dibujito.visible=false;
    touches=[];
  }
  
  //Estado de Jugar
  if(gameState === PLAY){
    //Piso infinito
    back.velocityY = 2;
    if(back.y > 390){
      back.y = 300;
    }
    //Mostrar al jugador
    player.visible=true;
    
    //Efecto gravedad
    player.velocityY = player.velocityY + 0.8;
    
    //Mover al Jugador 
    if(keyDown("right_arrow")){
      player.x = player.x+3;
      player.changeAnimation("right");
    }
  
    if(keyDown("left_arrow")){
      player.x = player.x-3;
      player.changeAnimation("left");
    }
    
    if(keyDown("up_arrow")){
      player.velocityY = -4;
    }
    
    //Mostrar Castillos y Snitch
    createCastillos();
    
    if(castilloGroup.isTouching(player)){
      player.velocityY = 0;
    }
    
    //Aumentar Puntos
    if(player.isTouching(snitchGroup, removeSnitch)){
      points = points + 10;
    }
    
    //Mostrar Dementores
    createDementores();
    
    //Cambiar a estao GAMEOVER
    if(player.isTouching(dementorGroup)){
      gameState=END;
    }
  }
  
  //Fin del Juego
  if(gameState === END){
    back.velocityY = 0;
    dementorGroup.setLifetimeEach(0);
    castilloGroup.setLifetimeEach(0);
    snitchGroup.setLifetimeEach(0);
    player.visible=false;
    textSize(30);
    fill("#7F0909");
    stroke("#FFC500")
    text("GAME OVER",110, 120);
    dibujito.visible=true;
    dibujito.x=220;
    dibujito.y=200;
    textSize(20);
    text(" Presiona ENTER ",130, 320);
    text("Para volver a comenzar",105, 350);
    if(( touches.length>0 || keyDown("enter")) && gameState === END){
      reset();
      touches=[];
    }
  }
   
}



//Castillos
function createCastillos(){
   if(frameCount % 200 === 0){
     var castillo = createSprite(random(70,320),0, 70, 20);
     castillo.velocityY = 2;
     castillo.addImage(castilloImg);
     castillo.scale = 0.3;
     castillo.setCollider('rectangle',100,100,550,30)
     castillo.depth = player.depth;
     player.depth = player.depth+3;
     castilloGroup.add(castillo);
     
     //Snitch
     var snitch= createSprite(castillo.x-70, castillo.y-50,100,350);
     snitch.addImage(snitchImg);
     snitch.velocityY= 2;
     snitch.velocityX=1;
     snitch.scale=0.02;
     snitch.depth = castillo.depth+3;   
     snitch.visible=true;
     snitchGroup.add(snitch);
   }
}

//Dementores
function createDementores(){
  if(frameCount % 150 === 0){
    var dementor = createSprite(random(70,400),0, 70, 20);
    dementor.velocityY = 3;
    dementor.addImage(dementorImg);
    dementor.setCollider('circle',-10,0,130);
    dementor.scale=0.5;
    dementorGroup.add(dementor);
  }
}

//Eliminar Snitch
function removeSnitch(sprite,snitchGroup){
   snitchGroup.remove();
}

//Reinicio
function reset(){
  puntos=0;
  gameState=PAUSE;
  location.reload();
}