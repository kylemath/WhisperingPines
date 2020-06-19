
let positions;
let videoInput;
let tf="...........................";
let cnv
let outputArea = 0;
let outputSmile = 0;

function setup() {

  // setup camera capture
  videoInput = createCapture(VIDEO);
  videoInput.size(1000, 800);
  drawBack();
  videoInput.position(0, 0);
  
  // setup canvas
  cnv = createCanvas(1000, 800);
  cnv.position(0, 0);

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);
  
  // setup emotion classifier
  classifier = new emotionClassifier();
  classifier.init(emotionModel);
  emotionData = classifier.getBlank();
  
  tf=tf.split('');
}

function drawBack() {
  background(55)
  fill(77, 111, 33);
  noStroke();
}


let j=0;

function draw() {

  clear();
  drawBack();

  proximity = round(outputArea * 100);
  thisAngle = map(proximity, 0, 100, .5, 10);
  thisHeight = map(proximity, 0, 100, 50, 250);
  thisBloom = map(round(outputSmile * 100), 0, 100, 10, 1);



  push();
  translate(0, height * 0.9);
  for (let i = 1; i < 2; i++) {
    translate(width/2, 0);
    push();
    branch(thisHeight);
    pop();
  }
  pop();
  
  if (videoInput) {
    translate(videoInput.width, 0);
    scale(-1, 1);
    // image(videoInput, 0, 0, width, width * videoInput.height / videoInput.width)
  }
  // get array of face marker positions [x, y] format
  positions = ctracker.getCurrentPosition();
  parameters = ctracker.getCurrentParameters();
  
  emotionRecognition = classifier.meanPredict(parameters)
  


  if (positions) {
    
    push();
    textSize(18);
    textAlign(CENTER);
    outputSmile = emotionRecognition[5].value;
    console.log('Smile = ' + round(outputSmile * 100) + '%')
    pop();
  
    
    // for face size
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    for (var i=0; i<positions.length; i++) {

      // calculate face size
      if (positions[i][0] < minX) {
        minX = positions[i][0];
      }
      if (positions[i][0] > maxX) {
        maxX = positions[i][0];
      }
      if (positions[i][1] < minY) {
        minY = positions[i][1];
      }
      if (positions[i][1] > maxY) {
        maxY = positions[i][1]
      }

      // draw face landmarks
      stroke(0);
      fill(0);
      text(tf[j],positions[i][0],positions[i][1]);
      j++;
      if(j>=text.length){
          j=0;
      }
    }

    boxWidth = maxX-minX;
    boxHeight = maxY-minY;
    outputArea = (boxWidth * boxHeight) / (width * height);

    push();
    textSize(18);
    textAlign(CENTER);
    console.log('Proximity = ' + round(outputArea * 100) + '%')

    // Draw box on face
    noFill()
    rect(minX, minY, boxWidth, boxHeight);
    
    // draw nose position
    noStroke();
    fill(0, 255, 255);
    outputX = positions[62][0];
    outputY = positions[62][1];

    ellipse(outputX, outputY, 10, 10);

    pop();



  }
}

function branch(blength) {
  stroke(40, 30, 10);
  if (blength < 10) {
    stroke(0, 200, 0);
  }
  if (blength < 4) {
    stroke(random(155, 200), random(50, 140), 0);
  }
  strokeWeight(blength / 14);
  line(0, 0, 0, -blength);
  translate(0, -blength);
  if (blength > thisBloom) {
    push();
    rotate(thisAngle * 7 / blength);
    branch(blength * 0.6)
    pop();
    push();
    rotate(-thisAngle * 7 / blength);
    branch(blength * 0.7);
    pop();
  }
}
