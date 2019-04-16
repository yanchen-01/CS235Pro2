// Yan Chen
// CS235 Project 2

var dataFile;
var data;
var yearSelected = 2011;
var ethniSelected = "Asian and Pacific Islander";
var ethnicity = ["Asian and Pacific Islander", "Black non Hispanic", "Hispanic", "White non Hispanic"];
var bs = []; // for buttons

class btns { // class for interactive buttons
  constructor(label, x, y, w, h) {
    this.labelName = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.filling = 240;
  }

  show() { // show the buttons
    noStroke();
    if (this.labelName == yearSelected || this.labelName == ethniSelected) {
      this.filling = 180;
    }
    fill(this.filling);
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    textAlign(CENTER);
    if (this.y > 450) { // for years buttons
      text(this.labelName, this.x + 50, this.y + 30);
    } else { // for ethnicity buttons
      text(this.labelName, this.x + 100, this.y + 30);
    }
  }

  clicked(px, py) { // change if the button is clicked
    if (px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h) {
      if (this.y > 450) { // for years buttons
        yearSelected = this.labelName;
      } else { // for ethnicity buttons
        ethniSelected = this.labelName;
      }
    } else {
      this.filling = 240; // if the button not clicked
    }
  }
}

function preload() {
  let url =
    'https://data.cityofnewyork.us/api/views/25th-nujf/rows.json';
  dataFile = loadJSON(url);
}

function setup() {  
  createCanvas(850, 600);
  
  data = dataFile.data;

  // create buttons for ethnicity
  for (let i = 0; i < ethnicity.length; i++) {
    var e = new btns(ethnicity[i], 10, i * 60 + 100, 200, 50);
    bs.push(e);
  } 

  // create buttons for years
  for (let i = 2011; i <= 2016; i++) {
    var y = new btns(i, (i - 2011) * 100 + 250, 550, 100, 50);
    bs.push(y);
  }
}

function draw() {
  background(255);

  // draw the buttons
  for (let i = 0; i < bs.length; i++) {
    bs[i].show();
  }

  // draw legend 
  // pink for females
  fill(255, 0, 150);
  rect(100, 350, 10, 10);

  // blue for males
  fill(0, 150, 255);
  rect(100, 380, 10, 10);

  fill(0);
  textFont('Arial');
  textAlign(LEFT);
  text("Females", 120, 360);
  text("Males", 120, 390);

  // display the data  
  display(yearSelected, ethniSelected);
  
}

function mousePressed() {
  // go through all the buttons see which one is clicked
  for (let i = 0; i < bs.length; i++) {
    bs[i].clicked(mouseX, mouseY);
  }

}

// display the data based on year and ethnicity selected
function display(year, ethni) {
  // display the selected ethnicity and year
  fill(0);
  textSize(25);
  text(ethni + ", " + year, 20, 60);
  
  // go through the data
  for (let i = 0; i < data.length; i++) {
    // find the data for selected year and ethnicity  
    var theYear = data[i][8];
    var theEthni = data[i][10];
    if (theYear == year && theEthni.charAt(0) == ethni.charAt(0)) {
      var gender = data[i][9];
      // only go through top 3
      if (i == 0 || (gender == "FEMALE" && data[i - 1][9] == "MALE") || (gender == "MALE" && data[i - 1][9] == "FEMALE") || theEthni != data[i - 1][10]) {
        for (let j = 1; j <= 3; j++) { // get the top 3 data;     
          var rank = j;
          var name = data[i + j - 1][11];
          var count = data[i + j - 1][12];
          if (gender == "FEMALE") { // pink bars for females
            fill(255, 0, 150);
            rank = rank * 100 + (rank - 1) * 50;
          } else { // blue bars for males
            fill(0, 150, 255);
            rank = rank * 150;
          }
          // draw the bars        
          rect(400, rank, map(count, 0, 387, 175, 400), 50);

          // display the name
          fill(20);
          textSize(20);
          text(name.toUpperCase(), 260, rank + 30);

          //display the count
          fill(255);
          textSize(15);
          text(count, 420, rank + 30);
        }
      }
    }
  }
}