
let positions;
let videoInput;
let tf="...........................";
let cnv

function setup() {

  // setup camera capture
  videoInput = createCapture(VIDEO);
  videoInput.size(400, 300);
  videoInput.position(0, 0);
  
  // setup canvas
  cnv = createCanvas(400, 300);
  cnv.position(0, 0);

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);
  
  classifier = new emotionClassifier();
  classifier.init(emotionModel);
  emotionData = classifier.getBlank();
  
  fill(255);

  tf=tf.split('');
  console.log(text);
}

let j=0;

function draw() {
  clear();

  if (videoInput) {
    image(videoInput, 0, 0, width, width * videoInput.height / videoInput.width)
  }
  // get array of face marker positions [x, y] format
  positions = ctracker.getCurrentPosition();
  parameters = ctracker.getCurrentParameters();
  
  emotionRecognition = classifier.meanPredict(parameters)
  
  if (positions) {
    
    push();
    textSize(36);
    textAlign(CENTER);
    text('Smile = ' + round(emotionRecognition[5].value * 100) + '%', width/2, height/2)
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
    area = (boxWidth * boxHeight) / (width * height);

    push();
    textSize(36);
    textAlign(CENTER);
    text('Proximity = ' + round(area * 100) + '%', width/2, height/4)

    noFill()
    rect(minX, minY, boxWidth, boxHeight);
    
    noStroke();
    fill(0, 255, 255);
    ellipse(positions[62][0], positions[62][1], 10, 10);

    pop();
  }

}
