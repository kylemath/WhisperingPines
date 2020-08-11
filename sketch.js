let positions;
let videoInput;
let cnv
let outputArea = 0;
let outputSmile = 0;
let soundFile;
let panning; 
let scene_num = 0; // index of which screen of the UX flow you are in
let j = 0;
let wind_on = false;
let backvoices_on = false;
let voices_on = false;


function preload() {
  soundFormats('mp3', 'ogg');
  soundFileA = loadSound('assets/auditory/voices/01-pagan burial.mp3');
  soundFileB = loadSound('assets/auditory/viola/16.1 Viola Moody.mp3');
  soundFileWind = loadSound('assets/auditory/wind_only.mp3')
  soundFileVoices = loadSound('assets/auditory/all voices_only.mp3')
  
  bg_title = loadImage('assets/visual/bg_title.jpg')
  bg_cam = loadImage('assets/visual/bg_cam.jpg')
  bg_intro = loadImage('assets/visual/bg_intro.jpg')
  bg_credits = loadImage('assets/visual/bg_credits.jpg')
  
  hotspot1 = loadImage('assets/visual/Page_01.jpg')
   
}

function setup() {

  // setup camera capture
  videoInput = createCapture(VIDEO);
  videoInput.size(1000, 563);
  videoInput.position(0, 0);

  // setup canvas
  cnv = createCanvas(1000, 563);
  cnv.position(0, 0);

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);

  // setup emotion classifier
  classifier = new emotionClassifier();
  classifier.init(emotionModel);
  emotionData = classifier.getBlank();

  // setup background gain
  backgroundGain = new p5.Gain();
  backgroundGain.connect();
  backgroundGain.amp(1); 

  soundFileWind.disconnect();
  soundFileWindGain = new p5.Gain();
  soundFileWindGain.setInput(soundFileWind);
  soundFileWindGain.connect(backgroundGain);

  soundFileVoices.disconnect();
  soundFileVoicesGain = new p5.Gain();
  soundFileVoicesGain.setInput(soundFileVoices);
  soundFileVoicesGain.connect(backgroundGain);

  // setup foreground gain
  masterGain = new p5.Gain();
  masterGain.connect();

  soundFileA.disconnect(); // diconnect from p5 output
  soundFileAGain = new p5.Gain(); // setup a gain node
  soundFileAGain.setInput(soundFileA); // connect the first sound to its input
  soundFileAGain.connect(masterGain);

  soundFileB.disconnect(); // diconnect from p5 output
  soundFileBGain = new p5.Gain(); // setup a gain node
  soundFileBGain.setInput(soundFileB); // connect the first sound to its input
  soundFileBGain.connect(masterGain)

}

function mousePressed() {
  scene_num++;
}

function draw() {

  clear();
  switch(scene_num) {
    case 0:
      scene0();
      break;
    case 1:
      scene1();
      break;
    case 2:
      scene2();
      break;
    case 3:
      scene3();
      break;
    case 4:
      scene4();
      break;
    default:
      //
  }
}

function scene0() {
  background(bg_title);
}

function scene1() {
  background(bg_cam);
  if (!wind_on) {
    soundFileWind.loop()
    soundFileWind.pan(0);
    soundFileWindGain.amp(1);
    wind_on = true;
  }
}

function scene2() {
  background(bg_intro);
  if (!backvoices_on) {
    soundFileVoices.loop()
    soundFileVoices.pan(0);
    soundFileVoicesGain.amp(1);
    backvoices_on = true;
  }
}

function scene3() {
  //put hotspot background on
  background(hotspot1);

  //turn on sounds
  if (!voices_on) {
    soundFileA.loop()
    soundFileB.loop()    
    voices_on = true;
  }

  // meausure some things about face
  proximity = round(outputArea * 100);
  thisAngle = map(proximity, 0, 100, .5, 10);
  thisHeight = map(proximity, 0, 100, 50, 250);
  thisBloom = map(round(outputSmile * 100), 0, 100, 10, 1);

  // flip camera to match head movement
  if (videoInput) {
    translate(videoInput.width, 0);
    scale(-1, 1);
  }
  // get array of face marker positions [x, y] format
  positions = ctracker.getCurrentPosition();
  parameters = ctracker.getCurrentParameters();

  // predict emotion
  emotionRecognition = classifier.meanPredict(parameters)

  // once these are working
  if (positions && emotionRecognition) {

    // check on smile
    outputSmile = emotionRecognition[5].value;
    console.log('Smile = ' + round(outputSmile * 100) + '%')

    // calculate face size
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    for (var i = 0; i < positions.length; i++) {
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
    }
    boxWidth = maxX - minX;
    boxHeight = maxY - minY;
    outputArea = (boxWidth * boxHeight) / (width * height);
    console.log('Proximity = ' + round(outputArea * 100) + '%')

    // Draw box on face
    push();
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

function pan_sounds() {
    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust foreground voices so one on left one on right
    soundFileA.pan(-1.0);
    soundFileB.pan(1.0);

    //adjust relative sound amplitude based on gaze location
    soundFileAGain.amp(voicebalance);
    soundFileBGain.amp(1-voicebalance);

    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}

function scene4() {
  background(bg_credits);
  soundFileVoices.stop()
  soundFileVoices.stop()

}
