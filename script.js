var maxCostLimit = 1000;
var currentCost = 0;
var stomachPoints = 0;
var correctAns = 0;

// Arrays are:
// points
// matrix

// fries , skull, noodles, burger, pav, mojito, pasta
function dishNumber(dish) {
  switch (dish) {
    case "milk":
      return 1;
      break;
    case "lassi":
      return 2;
      break;
    case "roti":
      return 3;
      break;
    case "pratha":
      return 4;
      break;
    case "friedrice":
      return 5;
      break;
    case "idli":
      return 6;
      break;
    case "dal":
      return 7;
      break;
  }
}

function displayPoints() {
  let pointsDisplay = document.getElementById("stomachPoints");
  pointsDisplay.innerText = stomachPoints;

  let costDisplay = document.getElementById("costing");
  costDisplay.innerText = currentCost;


}

let weights = [];
let values = [];
let cooking = [];
let rightCook = [];

// stomachPoints list
let points = [];
for (let i = 1; i <= 7; i++) {
  let randomNum = Math.floor(Math.random() * 10) + 1; // Generates a random integer between 0 and 9
  let value = document.getElementById("point" + i);
  value.innerHTML = randomNum;
  points.push(randomNum);
}
for (let i = 0; i < 5; i++) {
  for (let i = 0; i < points.length; i++) {
    const element = points[i];
    values.push(element);
  }
}

// matrix of menus
// matrix me matrix[stall][dish]
let matrix = [];
for (let i = 1; i <= 5; i++) {
  let menu = [];
  for (let j = 1; j <= 7; j++) {
    let randomNum = Math.floor((Math.floor(Math.random() * 300) + 100) / 50); // Generates a random integer between 100 and 399
    randomNum *= 50;
    menu.push(randomNum);
    let value = document.getElementById("stall" + i);
    let item = value.querySelector(".item" + j); // Use querySelector to target the specific element
    item.innerHTML = randomNum;
    weights.push(randomNum);
    cooking.push(0);
    rightCook.push(0);
  }
  matrix.push(menu);
}

let pointsDisplay = document.getElementById("stomachPoints");
pointsDisplay.innerText = stomachPoints;

let costDisplay = document.getElementById("costing");
costDisplay.innerText = currentCost;

// KNAPSACK ALGO
const n = weights.length;
const dp = [];

// Initialize the dp table
for (let i = 0; i <= n; i++) {
  dp[i] = [];
  for (let j = 0; j <= maxCostLimit; j++) {
    dp[i][j] = 0;
  }
}

// Build the dp table
for (let i = 1; i <= n; i++) {
  for (let j = 0; j <= maxCostLimit; j++) {
    if (weights[i - 1] <= j) {
      dp[i][j] = Math.max(
        values[i - 1] + dp[i - 1][j - weights[i - 1]],
        dp[i - 1][j]
      );
    } else {
      dp[i][j] = dp[i - 1][j];
    }
  }
}

// Find the items included in the knapsack
const selectedItems = [];
let i = n;
let j = maxCostLimit;
while (i > 0 && j > 0) {
  if (dp[i][j] !== dp[i - 1][j]) {
    selectedItems.push(i - 1);
    j -= weights[i - 1];
  }
  i--;
}
rightCook =  selectedItems;
correctAns = dp[n][maxCostLimit];
//

// now the functioning OF touching
let arrayOfItems = document.getElementsByClassName("list-group-item");
for (let index = 0; index < arrayOfItems.length; index++) {
  let element = arrayOfItems[index];
  element.addEventListener("click", serveTheItem);

  function serveTheItem() {
    let dishName = element.classList[1];
    let dishId = dishNumber(dishName);
    let stallElement = element.parentElement.parentElement.parentElement;
    let idsString = stallElement.id;
    let stallNumber = idsString[5];
    // changes

    if(cooking[(stallNumber-1)*7 + dishId]==1){
      alert("Dish already cooking, cant reorder same thing from same shop");
      return;
    }

    let newCost = matrix[stallNumber - 1][dishId - 1];
    if (currentCost + newCost <= maxCostLimit) {
      currentCost += newCost;
      stomachPoints += points[dishId - 1];
      cooking[(stallNumber-1)*7 + dishId]=1;
    } else {
      console.log("Money finsih, go to your parents");
      alert("Not enough money, try again by refreshing");
      return;
    }
    if(stomachPoints == correctAns){
        window.location.href = "link.html";
    }

    displayPoints();
    element.innerHTML = "<h5>Cooking</h5><img id ='cook' src='assets/cooking.gif'>";
    element.classList.add("cookingRed");
    console.log(rightCook);
  }
}