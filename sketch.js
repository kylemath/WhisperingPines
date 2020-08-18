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


  soundFileC1 = loadSound('assets/auditory/voices/01-pagan burial.mp3');
  soundFileC2 = loadSound('assets/auditory/voices/06-water witching_story.mp3');
  soundFileC3 = loadSound('assets/auditory/voices/09-nanabush_sleeping giant.mp3');
  soundFileC4 = loadSound('assets/auditory/voices/12-frog, frog, frog.mp3');

  soundFileD1 = loadSound('assets/auditory/viola/16.5 Viola Moody.mp3');
  soundFileD2 = loadSound('assets/auditory/viola/16.6 Viola Moody.mp3');
  soundFileD3 = loadSound('assets/auditory/viola/16.7 Viola Moody.mp3');
  soundFileD4 = loadSound('assets/auditory/viola/16.8 Viola Moody.mp3');


  soundFileE1 = loadSound('assets/auditory/voices/13-chopped down all the trees.mp3');
  soundFileE2 = loadSound('assets/auditory/voices/08-i couldnt buy a job.mp3');
  soundFileE3 = loadSound('assets/auditory/voices/05.1 Tom Thomson_story.mp3');
  soundFileE4 = loadSound('assets/auditory/voices/15-no women in camps HISS.mp3');

  soundFileF1 = loadSound('assets/auditory/viola/16.9 Viola Moody.mp3');
  soundFileF2 = loadSound('assets/auditory/viola/16.10 Viola Moody.mp3');
  soundFileF3 = loadSound('assets/auditory/viola/16.11 Viola Moody.mp3');
  soundFileF4 = loadSound('assets/auditory/viola/16.12 Viola Moody.mp3');


  soundFileWind = loadSound('assets/auditory/wind_only.mp3')
  soundFileVoices = loadSound('assets/auditory/all voices_only.mp3')
  
  bg_title = loadImage('assets/visual/bg_title.jpg')
  bg_cam = loadImage('assets/visual/bg_cam.jpg')
  bg_intro = loadImage('assets/visual/bg_intro.jpg')
  bg_credits = loadImage('assets/visual/bg_credits.jpg')
  
  hotspot1 = loadImage('assets/visual/Page_01.jpg')
  hotspot2 = loadImage('assets/visual/Page_02.jpg')
  hotspot3 = loadImage('assets/visual/Page_03.jpg')
  // hotspot4 = loadImage('assets/visual/Page_04.jpg')
  // hotspot5 = loadImage('assets/visual/Page_05.jpg')
  // hotspot6 = loadImage('assets/visual/Page_06.jpg')
  // hotspot7 = loadImage('assets/visual/Page_07.jpg')
  // hotspot8 = loadImage('assets/visual/Page_08.jpg')
  // hotspot9 = loadImage('assets/visual/Page_09.jpg')
  // hotspot10 = loadImage('assets/visual/Page_10.jpg')
  // hotspot11 = loadImage('assets/visual/Page_11.jpg')
  // hotspot12 = loadImage('assets/visual/Page_12.jpg')

  nose_spot = loadImage('assets/visual/nose_button.png')
  nose_spot_red = loadImage('assets/visual/nose_button_red.png')
  nose_spot_green = loadImage('assets/visual/nose_button_green.png')

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

  ///
  /// AB

  soundFileA1.disconnect(); // diconnect from p5 output
  soundFileA1Gain = new p5.Gain(); // setup a gain node
  soundFileA1Gain.setInput(soundFileA1); // connect the first sound to its input
  soundFileA1Gain.connect(masterGain);

  soundFileB1.disconnect(); // diconnect from p5 output
  soundFileB1Gain = new p5.Gain(); // setup a gain node
  soundFileB1Gain.setInput(soundFileB1); // connect the first sound to its input
  soundFileB1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileA1.pan(1.0);
  soundFileB1.pan(0.0);

  soundFileA2.disconnect(); // diconnect from p5 output
  soundFileA2Gain = new p5.Gain(); // setup a gain node
  soundFileA2Gain.setInput(soundFileA2); // connect the first sound to its input
  soundFileA2Gain.connect(masterGain);

  soundFileB2.disconnect(); // diconnect from p5 output
  soundFileB2Gain = new p5.Gain(); // setup a gain node
  soundFileB2Gain.setInput(soundFileB2); // connect the first sound to its input
  soundFileB2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileA2.pan(0.5);
  soundFileB2.pan(0.0);

  soundFileA3.disconnect(); // diconnect from p5 output
  soundFileA3Gain = new p5.Gain(); // setup a gain node
  soundFileA3Gain.setInput(soundFileA3); // connect the first sound to its input
  soundFileA3Gain.connect(masterGain);

  soundFileB3.disconnect(); // diconnect from p5 output
  soundFileB3Gain = new p5.Gain(); // setup a gain node
  soundFileB3Gain.setInput(soundFileB3); // connect the first sound to its input
  soundFileB3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileA3.pan(-0.5);
  soundFileB3.pan(0.0);

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
  soundFileB4.pan(0.0);

  ///
  /// CD

  soundFileC1.disconnect(); // diconnect from p5 output
  soundFileC1Gain = new p5.Gain(); // setup a gain node
  soundFileC1Gain.setInput(soundFileC1); // connect the first sound to its input
  soundFileC1Gain.connect(masterGain);

  soundFileD1.disconnect(); // diconnect from p5 output
  soundFileD1Gain = new p5.Gain(); // setup a gain node
  soundFileD1Gain.setInput(soundFileD1); // connect the first sound to its input
  soundFileD1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileC1.pan(1.0);
  soundFileD1.pan(0.0);

  soundFileC2.disconnect(); // diconnect from p5 output
  soundFileC2Gain = new p5.Gain(); // setup a gain node
  soundFileC2Gain.setInput(soundFileC2); // connect the first sound to its input
  soundFileC2Gain.connect(masterGain);

  soundFileD2.disconnect(); // diconnect from p5 output
  soundFileD2Gain = new p5.Gain(); // setup a gain node
  soundFileD2Gain.setInput(soundFileD2); // connect the first sound to its input
  soundFileD2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileC2.pan(0.5);
  soundFileD2.pan(0.0);

  soundFileC3.disconnect(); // diconnect from p5 output
  soundFileC3Gain = new p5.Gain(); // setup a gain node
  soundFileC3Gain.setInput(soundFileC3); // connect the first sound to its input
  soundFileC3Gain.connect(masterGain);

  soundFileD3.disconnect(); // diconnect from p5 output
  soundFileD3Gain = new p5.Gain(); // setup a gain node
  soundFileD3Gain.setInput(soundFileD3); // connect the first sound to its input
  soundFileD3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileC3.pan(-0.5);
  soundFileD3.pan(0.0);

  soundFileC4.disconnect(); // diconnect from p5 output
  soundFileC4Gain = new p5.Gain(); // setup a gain node
  soundFileC4Gain.setInput(soundFileC4); // connect the first sound to its input
  soundFileC4Gain.connect(masterGain);

  soundFileD4.disconnect(); // diconnect from p5 output
  soundFileD4Gain = new p5.Gain(); // setup a gain node
  soundFileD4Gain.setInput(soundFileD4); // connect the first sound to its input
  soundFileD4Gain.connect(masterGain)      

  //adjust foreground voices so one on left one on right
  soundFileC4.pan(-1.0);
  soundFileD4.pan(0.0);

  ///
  /// EF

  soundFileE1.disconnect(); // diconnect from p5 output
  soundFileE1Gain = new p5.Gain(); // setup a gain node
  soundFileE1Gain.setInput(soundFileE1); // connect the first sound to its input
  soundFileE1Gain.connect(masterGain);

  soundFileF1.disconnect(); // diconnect from p5 output
  soundFileF1Gain = new p5.Gain(); // setup a gain node
  soundFileF1Gain.setInput(soundFileF1); // connect the first sound to its input
  soundFileF1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileE1.pan(1.0);
  soundFileF1.pan(0.0);

  soundFileE2.disconnect(); // diconnect from p5 output
  soundFileE2Gain = new p5.Gain(); // setup a gain node
  soundFileE2Gain.setInput(soundFileE2); // connect the first sound to its input
  soundFileE2Gain.connect(masterGain);

  soundFileF2.disconnect(); // diconnect from p5 output
  soundFileF2Gain = new p5.Gain(); // setup a gain node
  soundFileF2Gain.setInput(soundFileF2); // connect the first sound to its input
  soundFileF2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileE2.pan(0.5);
  soundFileF2.pan(0.0);

  soundFileE3.disconnect(); // diconnect from p5 output
  soundFileE3Gain = new p5.Gain(); // setup a gain node
  soundFileE3Gain.setInput(soundFileE3); // connect the first sound to its input
  soundFileE3Gain.connect(masterGain);

  soundFileF3.disconnect(); // diconnect from p5 output
  soundFileF3Gain = new p5.Gain(); // setup a gain node
  soundFileF3Gain.setInput(soundFileF3); // connect the first sound to its input
  soundFileF3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileE3.pan(-0.5);
  soundFileF3.pan(0.0);

  soundFileE4.disconnect(); // diconnect from p5 output
  soundFileE4Gain = new p5.Gain(); // setup a gain node
  soundFileE4Gain.setInput(soundFileE4); // connect the first sound to its input
  soundFileE4Gain.connect(masterGain);

  soundFileF4.disconnect(); // diconnect from p5 output
  soundFileF4Gain = new p5.Gain(); // setup a gain node
  soundFileF4Gain.setInput(soundFileF4); // connect the first sound to its input
  soundFileF4Gain.connect(masterGain)      

  //adjust foreground voices so one on left one on right
  soundFileE4.pan(-1.0);
  soundFileF4.pan(0.0);
}

function mousePressed() {
  if (scene_num == 0) {
    let fs = fullscreen();
    fullscreen(!fs);
    resizeCanvas(displayWidth, displayHeight)
  }
  voices_on = false;
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
      // Main scenes
    case 3:
      scene3();
      break;
    case 4:
      scene3();
      break;
    case 5:
      scene3();
      break;
      //
    case 6:
      scene6();
      break;
    case 7:
      scene7();
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
    soundFileWindGain.amp(.5);
    wind_on = true;
  }
}

function scene2() {
  background(bg_intro);
  if (!backvoices_on) {
    soundFileVoices.loop()
    soundFileVoices.pan(0);
    soundFileVoicesGain.amp(.5);
    backvoices_on = true;
  }
}

function scene3() {
  //put hotspot background on

  switch(scene_num) {
    case 3:
      background(hotspot1);
      break;
    case 4:
      background(hotspot2);
      break;
    case 5:
      background(hotspot3);
      break;
    default:
      //
  }

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
    console.log(emotionRecognition);
    // 0: {emotion: "angry", value: 0.05873836091453903}
    // 1: {emotion: "disgusted", value: 0.006970389350505129}
    // 2: {emotion: "fear", value: 0.007838597025081209}
    // 3: {emotion: "sad", value: 0.3644606514967711}
    // 4: {emotion: "surprised", value: 0.006303609805024607}
    // 5: {emotion: "happy", value: 0.02721371664183402}
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
    if (outputSmile > .9) {
      image(nose_spot_green, outputX, outputY, 25, 25)
    } else if (outputSmile < .1 && outputSmile != 0.0) {
      image(nose_spot_red, outputX, outputY, 25, 25)
    } else {
      image(nose_spot, outputX, outputY, 25, 25)
    }
    pop();

    switch(scene_num) {
      case 3:
        pan_sounds3();
        break;
      case 4:
        pan_sounds4();
        break;
      case 5:
        pan_sounds5();
        break;
      default:
        //
    }

  }
}

function pan_sounds3() {
    
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
      soundFileB1Gain.amp(1-outputSmile);
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
      soundFileB2Gain.amp(1-outputSmile);
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
      soundFileB3Gain.amp(1-outputSmile);
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
      soundFileB4Gain.amp(1-outputSmile);      
    }

   
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}


function pan_sounds4() {


    //select sound and start
    if (!voices_on) {
      soundFileA1.stop()
      soundFileB1.stop()
      soundFileA2.stop()
      soundFileB2.stop()
      soundFileA3.stop()
      soundFileB3.stop()
      soundFileA4.stop()
      soundFileB4.stop()

      soundFileC1Gain.amp(0);
      soundFileD1Gain.amp(0);
      soundFileC2Gain.amp(0);
      soundFileD2Gain.amp(0);
      soundFileC3Gain.amp(0);
      soundFileD3Gain.amp(0);
      soundFileC4Gain.amp(0);
      soundFileD4Gain.amp(0);      
      soundFileC1.loop()
      soundFileD1.loop()
      soundFileC2.loop()
      soundFileD2.loop() 
      soundFileC3.loop()
      soundFileD3.loop() 
      soundFileC4.loop()
      soundFileD4.loop()     
      voices_on = true;
    }

    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust relative sound amplitude based on gaze location

    if (voicebalance < .25) {
      soundFileC1Gain.amp(1);
      soundFileD1Gain.amp(1-outputSmile);
      soundFileC2Gain.amp(0);
      soundFileD2Gain.amp(0);
      soundFileC3Gain.amp(0);
      soundFileD3Gain.amp(0);
      soundFileC4Gain.amp(0);
      soundFileD4Gain.amp(0);
    } else if (voicebalance >= .25 && voicebalance < .50) {
      soundFileC1Gain.amp(0);
      soundFileD1Gain.amp(0);
      soundFileC2Gain.amp(1);
      soundFileD2Gain.amp(1-outputSmile);
      soundFileC3Gain.amp(0);
      soundFileD3Gain.amp(0);
      soundFileC4Gain.amp(0);
      soundFileD4Gain.amp(0);
    } else if (voicebalance >= .50 && voicebalance < .75) {
      soundFileC1Gain.amp(0);
      soundFileD1Gain.amp(0);
      soundFileC2Gain.amp(0);
      soundFileD2Gain.amp(0);
      soundFileC3Gain.amp(1);
      soundFileD3Gain.amp(1-outputSmile);
      soundFileC4Gain.amp(0);
      soundFileD4Gain.amp(0);    
    } else {
      soundFileC1Gain.amp(0);
      soundFileD1Gain.amp(0);
      soundFileC2Gain.amp(0);
      soundFileD2Gain.amp(0);
      soundFileC3Gain.amp(0);
      soundFileD3Gain.amp(0);
      soundFileC4Gain.amp(1);
      soundFileD4Gain.amp(1-outputSmile);      
    }

   
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}


function pan_sounds5() {


    //select sound and start
    if (!voices_on) {
      soundFileC1.stop()
      soundFileD1.stop()
      soundFileC2.stop()
      soundFileD2.stop()
      soundFileC3.stop()
      soundFileD3.stop()
      soundFileC4.stop()
      soundFileD4.stop()

      soundFileE1Gain.amp(0);
      soundFileF1Gain.amp(0);
      soundFileE2Gain.amp(0);
      soundFileF2Gain.amp(0);
      soundFileE3Gain.amp(0);
      soundFileF3Gain.amp(0);
      soundFileE4Gain.amp(0);
      soundFileF4Gain.amp(0);      
      soundFileE1.loop()
      soundFileF1.loop()
      soundFileE2.loop()
      soundFileF2.loop() 
      soundFileE3.loop()
      soundFileF3.loop() 
      soundFileE4.loop()
      soundFileF4.loop()     
      voices_on = true;
    }

    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust relative sound amplitude based on gaze location

    if (voicebalance < .25) {
      soundFileE1Gain.amp(1);
      soundFileF1Gain.amp(1-outputSmile);
      soundFileE2Gain.amp(0);
      soundFileF2Gain.amp(0);
      soundFileE3Gain.amp(0);
      soundFileF3Gain.amp(0);
      soundFileE4Gain.amp(0);
      soundFileF4Gain.amp(0);
    } else if (voicebalance >= .25 && voicebalance < .50) {
      soundFileE1Gain.amp(0);
      soundFileF1Gain.amp(0);
      soundFileE2Gain.amp(1);
      soundFileF2Gain.amp(1-outputSmile);
      soundFileE3Gain.amp(0);
      soundFileF3Gain.amp(0);
      soundFileE4Gain.amp(0);
      soundFileF4Gain.amp(0);
    } else if (voicebalance >= .50 && voicebalance < .75) {
      soundFileE1Gain.amp(0);
      soundFileF1Gain.amp(0);
      soundFileE2Gain.amp(0);
      soundFileF2Gain.amp(0);
      soundFileE3Gain.amp(1);
      soundFileF3Gain.amp(1-outputSmile);
      soundFileE4Gain.amp(0);
      soundFileF4Gain.amp(0);    
    } else {
      soundFileE1Gain.amp(0);
      soundFileF1Gain.amp(0);
      soundFileE2Gain.amp(0);
      soundFileF2Gain.amp(0);
      soundFileE3Gain.amp(0);
      soundFileF3Gain.amp(0);
      soundFileE4Gain.amp(1);
      soundFileF4Gain.amp(1-outputSmile);      
    }

   
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}

function scene6() {
  background(bg_credits);
  soundFileE1.stop()
  soundFileF1.stop()
  soundFileE2.stop()
  soundFileF2.stop()
  soundFileE3.stop()
  soundFileF3.stop()
  soundFileE4.stop()
  soundFileF4.stop()
}

function scene7() {
  soundFileWind.stop()
  soundFileVoices.stop()

}
