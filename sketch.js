var dog;
var happyDog;
var database;
var foodS = 0;
var foodStock;
var foodObj;
var button1,button2;
var fedTime,lastFed;

function preload()
{
  Dog = loadImage("Dog.png")
  Happydog = loadImage("Dog Wagging Tail.png")
}

function setup() {
  
	createCanvas(1200, 500);
  dog = createSprite(950,250,20,20);
  dog.addImage(Dog);
  dog.scale = 0.3;

  foodObj = new Food();

  feed = createButton("Feed your dog!")
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food!")
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
}


function draw() {  
  background(46,139,87)

  textSize(17.5);

  fill("white")

  stroke("black")

  text("Press the Up Arrow Key to feed your dog!",800,90)

  text("Treats Remaining : " + foodS,800,107.5)

  foodObj.display();

  fedTime = database.ref('Feed Time');
  fedTime.on("value",function(data){
    lastFed = data.val();

    fill(255,255,254);
    textSize(15)

    if(lastFed >= 12){
      text("Last Feed : " + lastFed%12 + "PM",250,30)
    }
    else if(lastFed === 0){
      text("Last Feed : 12 AM",350,30)
    }
    else{
      text("Last Feed : " + lastFed + "AM",350,30)
    }


  });

  drawSprites();
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<=0){
    x=0;
  }

  else{
    x=x-1
  }

  database.ref('/').update({
    Food : x
  })
}

function feedDog(){
  dog.addImage(Happydog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}