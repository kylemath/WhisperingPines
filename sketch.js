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
  soundFileA1 = loadSound('assets/auditory/voices/07-Don Parrot_red lake.mp3');
  soundFileA2 = loadSound('assets/auditory/voices/02-wendigo.mp3');
  soundFileA3 = loadSound('assets/auditory/voices/03-Art Lees.mp3');
  soundFileA4 = loadSound('assets/auditory/voices/10-ghost story_rosseau.mp3');


  soundFileB1 = loadSound('assets/auditory/viola/16.1 Viola Moody.mp3');
  soundFileB2 = loadSound('assets/auditory/viola/16.2 Viola Moody.mp3');
  soundFileB3 = loadSound('assets/auditory/viola/16.3 Viola Moody.mp3');
  soundFileB4 = loadSound('assets/auditory/viola/16.4 Viola Moody.mp3');


  soundFileWind = loadSound('assets/auditory/wind_only.mp3')
  soundFileVoices = loadSound('assets/auditory/all voices_only.mp3')
  
  bg_title = loadImage('assets/visual/bg_title.jpg')
  bg_cam = loadImage('assets/visual/bg_cam.jpg')
  bg_intro = loadImage('assets/visual/bg_intro.jpg')
  bg_credits = loadImage('assets/visual/bg_credits.jpg')
  
  hotspot1 = loadImage('assets/visual/Page_01.jpg')
  nose_spot = loadImage('assets/visual/nose_button.png')
   
}

function setup() {

  // setup camera capture
  videoInput = createCapture(VIDEO);
  videoInput.size(displayWidth, displayHeight);
  videoInput.position(0, 0);

  // setup canvas
  cnv = createCanvas(1000, 528);
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
  backgroundGain.amp(.1); 

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

  soundFileA1.disconnect(); // diconnect from p5 output
  soundFileA1Gain = new p5.Gain(); // setup a gain node
  soundFileA1Gain.setInput(soundFileA1); // connect the first sound to its input
  soundFileA1Gain.connect(masterGain);

  soundFileB1.disconnect(); // diconnect from p5 output
  soundFileB1Gain = new p5.Gain(); // setup a gain node
  soundFileB1Gain.setInput(soundFileB1); // connect the first sound to its input
  soundFileB1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileA1.pan(-1.0);
  soundFileB1.pan(1.0);

  soundFileA2.disconnect(); // diconnect from p5 output
  soundFileA2Gain = new p5.Gain(); // setup a gain node
  soundFileA2Gain.setInput(soundFileA2); // connect the first sound to its input
  soundFileA2Gain.connect(masterGain);

  soundFileB2.disconnect(); // diconnect from p5 output
  soundFileB2Gain = new p5.Gain(); // setup a gain node
  soundFileB2Gain.setInput(soundFileB2); // connect the first sound to its input
  soundFileB2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileA2.pan(-1.0);
  soundFileB2.pan(1.0);

  soundFileA3.disconnect(); // diconnect from p5 output
  soundFileA3Gain = new p5.Gain(); // setup a gain node
  soundFileA3Gain.setInput(soundFileA3); // connect the first sound to its input
  soundFileA3Gain.connect(masterGain);

  soundFileB3.disconnect(); // diconnect from p5 output
  soundFileB3Gain = new p5.Gain(); // setup a gain node
  soundFileB3Gain.setInput(soundFileB3); // connect the first sound to its input
  soundFileB3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileA3.pan(-1.0);
  soundFileB3.pan(1.0);

  soundFileA4.disconnect(); // diconnect from p5 output
  soundFileA4Gain = new p5.Gain(); // setup a gain node
  soundFileA4Gain.setInput(soundFileA4); // connect the first sound to its input
  soundFileA4Gain.connect(masterGain);

  soundFileB4.disconnect(); // diconnect from p5 output
  soundFileB4Gain = new p5.Gain(); // setup a gain node
  soundFileB4Gain.setInput(soundFileB4); // connect the first sound to its input
  soundFileB4Gain.connect(masterGain)      

  //adjust foreground voices so one on left one on right
  soundFileA4.pan(-1.0);
  soundFileB4.pan(1.0);
}

function mousePressed() {
  if (scene_num == 0) {
    let fs = fullscreen();
    fullscreen(!fs);
    resizeCanvas(displayWidth, displayHeight)
  }
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
    case 5:
      scene5();
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
    soundFileWindGain.amp(.1);
    wind_on = true;
  }
}

function scene2() {
  background(bg_intro);
  if (!backvoices_on) {
    soundFileVoices.loop()
    soundFileVoices.pan(0);
    soundFileVoicesGain.amp(.1);
    backvoices_on = true;
  }
}

function scene3() {
  //put hotspot background on
  background(hotspot1);

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
    proximity = round(outputArea * 100);
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
    image(nose_spot, outputX, outputY, 25, 25)
    pop();

    //turn on sounds
    pan_sounds();

  }
}

function pan_sounds() {
    
    //select sound and start
    if (!voices_on) {
      soundFileA1Gain.amp(0);
      soundFileB1Gain.amp(0);
      soundFileA2Gain.amp(0);
      soundFileB2Gain.amp(0);
      soundFileA3Gain.amp(0);
      soundFileB3Gain.amp(0);
      soundFileA4Gain.amp(0);
      soundFileB4Gain.amp(0);      
      soundFileA1.loop()
      soundFileB1.loop()
      soundFileA2.loop()
      soundFileB2.loop() 
      soundFileA3.loop()
      soundFileB3.loop() 
      soundFileA4.loop()
      soundFileB4.loop()     
      voices_on = true;
    }

    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust relative sound amplitude based on gaze location

    if (voicebalance < .25) {
      soundFileA1Gain.amp(1);
      soundFileB1Gain.amp(1);
      soundFileA2Gain.amp(0);
      soundFileB2Gain.amp(0);
      soundFileA3Gain.amp(0);
      soundFileB3Gain.amp(0);
      soundFileA4Gain.amp(0);
      soundFileB4Gain.amp(0);
    } else if (voicebalance >= .25 && voicebalance < .50) {
      soundFileA1Gain.amp(0);
      soundFileB1Gain.amp(0);
      soundFileA2Gain.amp(1);
      soundFileB2Gain.amp(1);
      soundFileA3Gain.amp(0);
      soundFileB3Gain.amp(0);
      soundFileA4Gain.amp(0);
      soundFileB4Gain.amp(0);
    } else if (voicebalance >= .50 && voicebalance < .75) {
      soundFileA1Gain.amp(0);
      soundFileB1Gain.amp(0);
      soundFileA2Gain.amp(0);
      soundFileB2Gain.amp(0);
      soundFileA3Gain.amp(1);
      soundFileB3Gain.amp(1);
      soundFileA4Gain.amp(0);
      soundFileB4Gain.amp(0);    
    } else {
      soundFileA1Gain.amp(0);
      soundFileB1Gain.amp(0);
      soundFileA2Gain.amp(0);
      soundFileB2Gain.amp(0);
      soundFileA3Gain.amp(0);
      soundFileB3Gain.amp(0);
      soundFileA4Gain.amp(1);
      soundFileB4Gain.amp(1);      
    }

   
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}

function scene4() {
  background(bg_credits);
  soundFileVoices.stop()
  soundFileA1.stop()
  soundFileB1.stop()
  soundFileA2.stop()
  soundFileB2.stop()
  soundFileA3.stop()
  soundFileB3.stop()
  soundFileA4.stop()
  soundFileB4.stop()
}

function scene5() {
  soundFileWind.stop()
}
