let positions;
let videoInput;
let cnv
let outputArea = 0;
let outputSmile = 0;
let soundFile;
let panning; 
let scene_num = 0; // index of which screen of the UX flow you are in
let wind_on = false;
let backvoices_on = false;
let voices_on = false;
let first_time = 1; // to only maximize on first time
let sceneTimerStart = 1;

function preload() {
  soundFormats('mp3', 'ogg');
  
  // Page 4
  soundFileA1 = loadSound('assets/auditory/voices/11.mp3');
  soundFileA2 = loadSound('assets/auditory/voices/04.mp3');
  soundFileA3 = loadSound('assets/auditory/voices/03.mp3');
  soundFileA4 = loadSound('assets/auditory/voices/07.mp3');

  soundFileB1 = loadSound('assets/auditory/viola/VIola_1.mp3');
  soundFileB2 = loadSound('assets/auditory/viola/VIola_2.mp3');
  soundFileB3 = loadSound('assets/auditory/viola/VIola_3.mp3');
  soundFileB4 = loadSound('assets/auditory/viola/VIola_4.mp3');

  // Page 5
  soundFileC1 = loadSound('assets/auditory/voices/23.mp3');
  soundFileC2 = loadSound('assets/auditory/voices/09.mp3');
  soundFileC3 = loadSound('assets/auditory/voices/02.mp3');
  soundFileC4 = loadSound('assets/auditory/voices/01.mp3');

  soundFileD1 = loadSound('assets/auditory/viola/VIola_5.mp3');
  soundFileD2 = loadSound('assets/auditory/viola/VIola_6.mp3');
  soundFileD3 = loadSound('assets/auditory/viola/VIola_7.mp3');
  soundFileD4 = loadSound('assets/auditory/viola/VIola_8.mp3');

  // Page 6
  soundFileE1 = loadSound('assets/auditory/voices/23.mp3');
  soundFileE2 = loadSound('assets/auditory/voices/16.mp3');
  soundFileE3 = loadSound('assets/auditory/voices/08.mp3');
  soundFileE4 = loadSound('assets/auditory/voices/12.mp3');

  soundFileF1 = loadSound('assets/auditory/viola/VIola_9.mp3');
  soundFileF2 = loadSound('assets/auditory/viola/VIola_10.mp3');
  soundFileF3 = loadSound('assets/auditory/viola/VIola_11.mp3');
  soundFileF4 = loadSound('assets/auditory/viola/VIola_12.mp3');

  // Page 7
  soundFileG1 = loadSound('assets/auditory/voices/05.mp3');
  soundFileG2 = loadSound('assets/auditory/voices/14.mp3');
  soundFileG3 = loadSound('assets/auditory/voices/10.mp3');
  soundFileG4 = loadSound('assets/auditory/voices/22.mp3');

  soundFileH1 = loadSound('assets/auditory/viola/VIola_13.mp3');
  soundFileH2 = loadSound('assets/auditory/viola/VIola_14.mp3');
  soundFileH3 = loadSound('assets/auditory/viola/VIola_15.mp3');
  soundFileH4 = loadSound('assets/auditory/viola/VIola_16.mp3');

  // Page 8
  soundFileI1 = loadSound('assets/auditory/voices/06.mp3');
  soundFileI2 = loadSound('assets/auditory/voices/17.mp3');
  soundFileI3 = loadSound('assets/auditory/voices/20.mp3');
  soundFileI4 = loadSound('assets/auditory/voices/21.mp3');

  soundFileJ1 = loadSound('assets/auditory/viola/VIola_17.mp3');
  soundFileJ2 = loadSound('assets/auditory/viola/VIola_18.mp3');
  soundFileJ3 = loadSound('assets/auditory/viola/VIola_19.mp3');
  soundFileJ4 = loadSound('assets/auditory/viola/VIola_20.mp3');

  // Page 9
  soundFileK1 = loadSound('assets/auditory/voices/15.mp3');
  soundFileK2 = loadSound('assets/auditory/voices/18.mp3');
  soundFileK3 = loadSound('assets/auditory/voices/24.mp3');
  soundFileK4 = loadSound('assets/auditory/voices/19.mp3');

  soundFileL1 = loadSound('assets/auditory/viola/VIola_21.mp3');
  soundFileL2 = loadSound('assets/auditory/viola/VIola_22.mp3');
  soundFileL3 = loadSound('assets/auditory/viola/VIola_23.mp3');
  soundFileL4 = loadSound('assets/auditory/viola/VIola_24.mp3');


  soundFileWind = loadSound('assets/auditory/wind_only.mp3')
  soundFileVoices = loadSound('assets/auditory/all voices_only.mp3')
  
  bg_title = loadImage('assets/visual/Page_01.jpg')
  bg_cam = loadImage('assets/visual/Page_02.jpg')
  bg_intro = loadImage('assets/visual/Page_03.jpg')
  bg_credits = loadImage('assets/visual/Page_10.jpg')
  bg_credits2 = loadImage('assets/visual/Page_11.jpg')
  bg_outro = loadImage('assets/visual/Page_12.jpg')

  hotspot1 = loadImage('assets/visual/Page_04.jpg')
  hotspot2 = loadImage('assets/visual/Page_05.jpg')
  hotspot3 = loadImage('assets/visual/Page_06.jpg')
  hotspot4 = loadImage('assets/visual/Page_07.jpg')
  hotspot5 = loadImage('assets/visual/Page_08.jpg')
  hotspot6 = loadImage('assets/visual/Page_09.jpg')

  nose_spot = loadImage('assets/visual/nose_button.png')
  nose_spot_red = loadImage('assets/visual/nose_button_red.png')
  nose_spot_green = loadImage('assets/visual/nose_button_green.png')

  setupSounds();

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

}

function setupSounds() {

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

  ///
  /// GH

  soundFileG1.disconnect(); // diconnect from p5 output
  soundFileG1Gain = new p5.Gain(); // setup a gain node
  soundFileG1Gain.setInput(soundFileG1); // connect the first sound to its input
  soundFileG1Gain.connect(masterGain);

  soundFileH1.disconnect(); // diconnect from p5 output
  soundFileH1Gain = new p5.Gain(); // setup a gain node
  soundFileH1Gain.setInput(soundFileH1); // connect the first sound to its input
  soundFileH1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileG1.pan(1.0);
  soundFileH1.pan(0.0);

  soundFileG2.disconnect(); // diconnect from p5 output
  soundFileG2Gain = new p5.Gain(); // setup a gain node
  soundFileG2Gain.setInput(soundFileG2); // connect the first sound to its input
  soundFileG2Gain.connect(masterGain);

  soundFileH2.disconnect(); // diconnect from p5 output
  soundFileH2Gain = new p5.Gain(); // setup a gain node
  soundFileH2Gain.setInput(soundFileH2); // connect the first sound to its input
  soundFileH2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileG2.pan(0.5);
  soundFileH2.pan(0.0);

  soundFileG3.disconnect(); // diconnect from p5 output
  soundFileG3Gain = new p5.Gain(); // setup a gain node
  soundFileG3Gain.setInput(soundFileG3); // connect the first sound to its input
  soundFileG3Gain.connect(masterGain);

  soundFileH3.disconnect(); // diconnect from p5 output
  soundFileH3Gain = new p5.Gain(); // setup a gain node
  soundFileH3Gain.setInput(soundFileH3); // connect the first sound to its input
  soundFileH3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileG3.pan(-0.5);
  soundFileH3.pan(0.0);

  soundFileG4.disconnect(); // diconnect from p5 output
  soundFileG4Gain = new p5.Gain(); // setup a gain node
  soundFileG4Gain.setInput(soundFileG4); // connect the first sound to its input
  soundFileG4Gain.connect(masterGain);

  soundFileH4.disconnect(); // diconnect from p5 output
  soundFileH4Gain = new p5.Gain(); // setup a gain node
  soundFileH4Gain.setInput(soundFileH4); // connect the first sound to its input
  soundFileH4Gain.connect(masterGain)      

  //adjust foreground voices so one on left one on right
  soundFileG4.pan(-1.0);
  soundFileH4.pan(0.0);

  ///
  /// IJ

  soundFileI1.disconnect(); // diconnect from p5 output
  soundFileI1Gain = new p5.Gain(); // setup a gain node
  soundFileI1Gain.setInput(soundFileI1); // connect the first sound to its input
  soundFileI1Gain.connect(masterGain);

  soundFileJ1.disconnect(); // diconnect from p5 output
  soundFileJ1Gain = new p5.Gain(); // setup a gain node
  soundFileJ1Gain.setInput(soundFileJ1); // connect the first sound to its input
  soundFileJ1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileI1.pan(1.0);
  soundFileJ1.pan(0.0);

  soundFileI2.disconnect(); // diconnect from p5 output
  soundFileI2Gain = new p5.Gain(); // setup a gain node
  soundFileI2Gain.setInput(soundFileI2); // connect the first sound to its input
  soundFileI2Gain.connect(masterGain);

  soundFileJ2.disconnect(); // diconnect from p5 output
  soundFileJ2Gain = new p5.Gain(); // setup a gain node
  soundFileJ2Gain.setInput(soundFileJ2); // connect the first sound to its input
  soundFileJ2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileI2.pan(0.5);
  soundFileJ2.pan(0.0);

  soundFileI3.disconnect(); // diconnect from p5 output
  soundFileI3Gain = new p5.Gain(); // setup a gain node
  soundFileI3Gain.setInput(soundFileI3); // connect the first sound to its input
  soundFileI3Gain.connect(masterGain);

  soundFileJ3.disconnect(); // diconnect from p5 output
  soundFileJ3Gain = new p5.Gain(); // setup a gain node
  soundFileJ3Gain.setInput(soundFileJ3); // connect the first sound to its input
  soundFileJ3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileI3.pan(-0.5);
  soundFileJ3.pan(0.0);

  soundFileI4.disconnect(); // diconnect from p5 output
  soundFileI4Gain = new p5.Gain(); // setup a gain node
  soundFileI4Gain.setInput(soundFileI4); // connect the first sound to its input
  soundFileI4Gain.connect(masterGain);

  soundFileJ4.disconnect(); // diconnect from p5 output
  soundFileJ4Gain = new p5.Gain(); // setup a gain node
  soundFileJ4Gain.setInput(soundFileJ4); // connect the first sound to its input
  soundFileJ4Gain.connect(masterGain)      

  //adjust foreground voices so one on left one on right
  soundFileI4.pan(-1.0);
  soundFileJ4.pan(0.0);

  ///
  /// KL

  soundFileK1.disconnect(); // diconnect from p5 output
  soundFileK1Gain = new p5.Gain(); // setup a gain node
  soundFileK1Gain.setInput(soundFileK1); // connect the first sound to its input
  soundFileK1Gain.connect(masterGain);

  soundFileL1.disconnect(); // diconnect from p5 output
  soundFileL1Gain = new p5.Gain(); // setup a gain node
  soundFileL1Gain.setInput(soundFileL1); // connect the first sound to its input
  soundFileL1Gain.connect(masterGain)
    
  //adjust foreground voices so one on left one on right
  soundFileK1.pan(1.0);
  soundFileL1.pan(0.0);

  soundFileK2.disconnect(); // diconnect from p5 output
  soundFileK2Gain = new p5.Gain(); // setup a gain node
  soundFileK2Gain.setInput(soundFileK2); // connect the first sound to its input
  soundFileK2Gain.connect(masterGain);

  soundFileL2.disconnect(); // diconnect from p5 output
  soundFileL2Gain = new p5.Gain(); // setup a gain node
  soundFileL2Gain.setInput(soundFileL2); // connect the first sound to its input
  soundFileL2Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileK2.pan(0.5);
  soundFileL2.pan(0.0);

  soundFileK3.disconnect(); // diconnect from p5 output
  soundFileK3Gain = new p5.Gain(); // setup a gain node
  soundFileK3Gain.setInput(soundFileK3); // connect the first sound to its input
  soundFileK3Gain.connect(masterGain);

  soundFileL3.disconnect(); // diconnect from p5 output
  soundFileL3Gain = new p5.Gain(); // setup a gain node
  soundFileL3Gain.setInput(soundFileL3); // connect the first sound to its input
  soundFileL3Gain.connect(masterGain)

  //adjust foreground voices so one on left one on right
  soundFileK3.pan(-0.5);
  soundFileL3.pan(0.0);

  soundFileK4.disconnect(); // diconnect from p5 output
  soundFileK4Gain = new p5.Gain(); // setup a gain node
  soundFileK4Gain.setInput(soundFileK4); // connect the first sound to its input
  soundFileK4Gain.connect(masterGain);

  soundFileL4.disconnect(); // diconnect from p5 output
  soundFileL4Gain = new p5.Gain(); // setup a gain node
  soundFileL4Gain.setInput(soundFileL4); // connect the first sound to its input
  soundFileL4Gain.connect(masterGain)      

  //adjust foreground voices so one on left one on right
  soundFileK4.pan(-1.0);
  soundFileL4.pan(0.0);  
}

function mousePressed() {
  if (scene_num == 0 && first_time == 1) {
    first_time = 0;
    let fs = fullscreen();
    fullscreen(!fs);
    resizeCanvas(displayWidth, displayHeight)
  }
  voices_on = false;
  scene_num++;
  sceneTimerStart = 1;
  if (scene_num == 1) {
    scene_start = millis();
  }
  if (scene_num == 12) {
    restartShow();
  }
}

function autoAdvance() {
  if (sceneTimerStart == 1) {
    sceneTimerStart = 0;
    scene_start = millis();
  }

  // auto advance after 180 seconds
  if (millis() - scene_start > 180000) { 
    scene_num++;
    sceneTimerStart = 1;
    if (scene_num == 12) {
      restartShow();
    }
  }
}

function restartShow() {
  scene_num = 0;
  wind_on = false;
  backvoices_on = false;
  voices_on = false;  

  soundFileWind.fade(1,0);
  soundFileVoices.fade(1,0);
  soundFileA1.fade(1,0);
  soundFileA2.fade(1,0);
  soundFileA3.fade(1,0);
  soundFileA4.fade(1,0);
  soundFileB1.fade(1,0);
  soundFileB2.fade(1,0);
  soundFileB3.fade(1,0);
  soundFileB4.fade(1,0);
  soundFileC1.fade(1,0);
  soundFileC2.fade(1,0);
  soundFileC3.fade(1,0);
  soundFileC4.fade(1,0);
  soundFileD1.fade(1,0);
  soundFileD2.fade(1,0);
  soundFileD3.fade(1,0);
  soundFileD4.fade(1,0);
  soundFileE1.fade(1,0);
  soundFileE2.fade(1,0);
  soundFileE3.fade(1,0);
  soundFileE4.fade(1,0);
  soundFileF1.fade(1,0);
  soundFileF2.fade(1,0);
  soundFileF3.fade(1,0);
  soundFileF4.fade(1,0);
  soundFileG1.fade(1,0);
  soundFileG2.fade(1,0);
  soundFileG3.fade(1,0);
  soundFileG4.fade(1,0);
  soundFileH1.fade(1,0);
  soundFileH2.fade(1,0);
  soundFileH3.fade(1,0);
  soundFileH4.fade(1,0);
  soundFileI1.fade(1,0);
  soundFileI2.fade(1,0);
  soundFileI3.fade(1,0);
  soundFileI4.fade(1,0);
  soundFileJ1.fade(1,0);
  soundFileJ2.fade(1,0);
  soundFileJ3.fade(1,0);
  soundFileJ4.fade(1,0);
  soundFileK1.fade(1,0);
  soundFileK2.fade(1,0);
  soundFileK3.fade(1,0);
  soundFileK4.fade(1,0);
  soundFileL1.fade(1,0);
  soundFileL2.fade(1,0);
  soundFileL3.fade(1,0);
  soundFileL4.fade(1,0);

  soundFileWind.stop();
  soundFileVoices.stop();
  soundFileA1.stop();
  soundFileA2.stop();
  soundFileA3.stop();
  soundFileA4.stop();
  soundFileB1.stop();
  soundFileB2.stop();
  soundFileB3.stop();
  soundFileB4.stop();
  soundFileC1.stop();
  soundFileC2.stop();
  soundFileC3.stop();
  soundFileC4.stop();
  soundFileD1.stop();
  soundFileD2.stop();
  soundFileD3.stop();
  soundFileD4.stop();
  soundFileE1.stop();
  soundFileE2.stop();
  soundFileE3.stop();
  soundFileE4.stop();
  soundFileF1.stop();
  soundFileF2.stop();
  soundFileF3.stop();
  soundFileF4.stop();
  soundFileG1.stop();
  soundFileG2.stop();
  soundFileG3.stop();
  soundFileG4.stop();
  soundFileH1.stop();
  soundFileH2.stop();
  soundFileH3.stop();
  soundFileH4.stop();
  soundFileI1.stop();
  soundFileI2.stop();
  soundFileI3.stop();
  soundFileI4.stop();
  soundFileJ1.stop();
  soundFileJ2.stop();
  soundFileJ3.stop();
  soundFileJ4.stop();
  soundFileK1.stop();
  soundFileK2.stop();
  soundFileK3.stop();
  soundFileK4.stop();
  soundFileL1.stop();
  soundFileL2.stop();
  soundFileL3.stop();
  soundFileL4.stop();      
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

    case 6:
      scene3();
      break;
    case 7:
      scene3();
      break;
    case 8:
      scene3();
      break;
        
      //Outros
    case 9:
      scene9();
      break;
    case 10:
      scene10();
      break;      
    case 11:
      scene11();
    default:
      //
  }
}

function scene0() {
  autoAdvance();
  background(bg_title);
}

function scene1() {
  autoAdvance();
  background(bg_cam);
  if (!wind_on) {
    soundFileWind.loop()
    soundFileWind.pan(0);
    soundFileWindGain.amp(.5);
    wind_on = true;
  }
  if (millis() - scene_start > 3000) {
    drawStatic();
  }

}

function scene2() {
  autoAdvance();
  background(bg_intro);
  if (!backvoices_on) {
    soundFileVoices.loop()
    soundFileVoices.pan(0);
    soundFileVoicesGain.amp(.5);
    backvoices_on = true;
  }

  drawStatic();

}

function drawStatic() {
  for (var ispot = 0; ispot < 2500; ispot++) { 
    squareColor = color(random(0,255))
    squareColor.setAlpha(35);  
    fill(squareColor);
    strokeWeight(0);
    rect(random(0,width), random(0,height), 10, 10);
  }
}

function scene3() {
  //put hotspot background on

  autoAdvance();

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
    case 6:
      background(hotspot4);
      break;
    case 7:
      background(hotspot5);
      break;
    case 8:
      background(hotspot6);
      break;
    default:
      //
  }

  drawStatic();

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
    // console.log(emotionRecognition);
    // 0: {emotion: "angry", value: 0.05873836091453903}
    // 1: {emotion: "disgusted", value: 0.006970389350505129}
    // 2: {emotion: "fear", value: 0.007838597025081209}
    // 3: {emotion: "sad", value: 0.3644606514967711}
    // 4: {emotion: "surprised", value: 0.006303609805024607}
    // 5: {emotion: "happy", value: 0.02721371664183402}
    // console.log('Smile = ' + round(outputSmile * 100) + '%')

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
    // console.log('Proximity = ' + round(outputArea * 100) + '%')

    // Draw box on face
    push();
    noFill()
    strokeWeight(1);
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
      case 6:
        pan_sounds6();
        break;
      case 7:
        pan_sounds7();
        break;
      case 8:
        pan_sounds8();
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
      soundFileA1.fade(0,1)
      soundFileB1.fade(0,1)
      soundFileA2.fade(0,1)
      soundFileB2.fade(0,1)
      soundFileA3.fade(0,1)
      soundFileB3.fade(0,1)
      soundFileA4.fade(0,1)
      soundFileB4.fade(0,1)

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
      soundFileC1.fade(0,1)
      soundFileD1.fade(0,1)
      soundFileC2.fade(0,1)
      soundFileD2.fade(0,1)
      soundFileC3.fade(0,1)
      soundFileD3.fade(0,1)
      soundFileC4.fade(0,1)
      soundFileD4.fade(0,1)

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


function pan_sounds6() {


    //select sound and start
    if (!voices_on) {
      soundFileE1.fade(0,1)
      soundFileF1.fade(0,1)
      soundFileE2.fade(0,1)
      soundFileF2.fade(0,1)
      soundFileE3.fade(0,1)
      soundFileF3.fade(0,1)
      soundFileE4.fade(0,1)
      soundFileF4.fade(0,1)

      soundFileG1Gain.amp(0);
      soundFileH1Gain.amp(0);
      soundFileG2Gain.amp(0);
      soundFileH2Gain.amp(0);
      soundFileG3Gain.amp(0);
      soundFileH3Gain.amp(0);
      soundFileG4Gain.amp(0);
      soundFileH4Gain.amp(0);      
      soundFileG1.loop()
      soundFileH1.loop()
      soundFileG2.loop()
      soundFileH2.loop() 
      soundFileG3.loop()
      soundFileH3.loop() 
      soundFileG4.loop()
      soundFileH4.loop()     
      voices_on = true;
    }

    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust relative sound amplitude based on gaze location

    if (voicebalance < .25) {
      soundFileG1Gain.amp(1);
      soundFileH1Gain.amp(1-outputSmile);
      soundFileG2Gain.amp(0);
      soundFileH2Gain.amp(0);
      soundFileG3Gain.amp(0);
      soundFileH3Gain.amp(0);
      soundFileG4Gain.amp(0);
      soundFileH4Gain.amp(0);
    } else if (voicebalance >= .25 && voicebalance < .50) {
      soundFileG1Gain.amp(0);
      soundFileH1Gain.amp(0);
      soundFileG2Gain.amp(1);
      soundFileH2Gain.amp(1-outputSmile);
      soundFileG3Gain.amp(0);
      soundFileH3Gain.amp(0);
      soundFileG4Gain.amp(0);
      soundFileH4Gain.amp(0);
    } else if (voicebalance >= .50 && voicebalance < .75) {
      soundFileG1Gain.amp(0);
      soundFileH1Gain.amp(0);
      soundFileG2Gain.amp(0);
      soundFileH2Gain.amp(0);
      soundFileG3Gain.amp(1);
      soundFileH3Gain.amp(1-outputSmile);
      soundFileG4Gain.amp(0);
      soundFileH4Gain.amp(0);    
    } else {
      soundFileG1Gain.amp(0);
      soundFileH1Gain.amp(0);
      soundFileG2Gain.amp(0);
      soundFileH2Gain.amp(0);
      soundFileG3Gain.amp(0);
      soundFileH3Gain.amp(0);
      soundFileG4Gain.amp(1);
      soundFileH4Gain.amp(1-outputSmile);      
    }

   
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}


function pan_sounds7() {


    //select sound and start
    if (!voices_on) {
      soundFileG1.fade(0,1)
      soundFileH1.fade(0,1)
      soundFileG2.fade(0,1)
      soundFileH2.fade(0,1)
      soundFileG3.fade(0,1)
      soundFileH3.fade(0,1)
      soundFileG4.fade(0,1)
      soundFileH4.fade(0,1)

      soundFileI1Gain.amp(0);
      soundFileJ1Gain.amp(0);
      soundFileI2Gain.amp(0);
      soundFileJ2Gain.amp(0);
      soundFileI3Gain.amp(0);
      soundFileJ3Gain.amp(0);
      soundFileI4Gain.amp(0);
      soundFileJ4Gain.amp(0);      
      soundFileI1.loop()
      soundFileJ1.loop()
      soundFileI2.loop()
      soundFileJ2.loop() 
      soundFileI3.loop()
      soundFileJ3.loop() 
      soundFileI4.loop()
      soundFileJ4.loop()     
      voices_on = true;
    }

    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust relative sound amplitude based on gaze location

    if (voicebalance < .25) {
      soundFileI1Gain.amp(1);
      soundFileJ1Gain.amp(1-outputSmile);
      soundFileI2Gain.amp(0);
      soundFileJ2Gain.amp(0);
      soundFileI3Gain.amp(0);
      soundFileJ3Gain.amp(0);
      soundFileI4Gain.amp(0);
      soundFileJ4Gain.amp(0);
    } else if (voicebalance >= .25 && voicebalance < .50) {
      soundFileI1Gain.amp(0);
      soundFileJ1Gain.amp(0);
      soundFileI2Gain.amp(1);
      soundFileJ2Gain.amp(1-outputSmile);
      soundFileI3Gain.amp(0);
      soundFileJ3Gain.amp(0);
      soundFileI4Gain.amp(0);
      soundFileJ4Gain.amp(0);
    } else if (voicebalance >= .50 && voicebalance < .75) {
      soundFileI1Gain.amp(0);
      soundFileJ1Gain.amp(0);
      soundFileI2Gain.amp(0);
      soundFileJ2Gain.amp(0);
      soundFileI3Gain.amp(1);
      soundFileJ3Gain.amp(1-outputSmile);
      soundFileI4Gain.amp(0);
      soundFileJ4Gain.amp(0);    
    } else {
      soundFileI1Gain.amp(0);
      soundFileJ1Gain.amp(0);
      soundFileI2Gain.amp(0);
      soundFileJ2Gain.amp(0);
      soundFileI3Gain.amp(0);
      soundFileJ3Gain.amp(0);
      soundFileI4Gain.amp(1);
      soundFileJ4Gain.amp(1-outputSmile);      
    }

   
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}


function pan_sounds8() {


    //select sound and start
    if (!voices_on) {
      soundFileI1.fade(0,1)
      soundFileJ1.fade(0,1)
      soundFileI2.fade(0,1)
      soundFileJ2.fade(0,1)
      soundFileI3.fade(0,1)
      soundFileJ3.fade(0,1)
      soundFileI4.fade(0,1)
      soundFileJ4.fade(0,1)

      soundFileK1Gain.amp(0);
      soundFileL1Gain.amp(0);
      soundFileK2Gain.amp(0);
      soundFileL2Gain.amp(0);
      soundFileK3Gain.amp(0);
      soundFileL3Gain.amp(0);
      soundFileK4Gain.amp(0);
      soundFileL4Gain.amp(0);      
      soundFileK1.loop()
      soundFileL1.loop()
      soundFileK2.loop()
      soundFileL2.loop() 
      soundFileK3.loop()
      soundFileL3.loop() 
      soundFileK4.loop()
      soundFileL4.loop()     
      voices_on = true;
    }

    //get nose position 
    gazeX = constrain(outputX, 0, width);
    voicebalance = map(gazeX, 0, width, 0, 1);
    
    //adjust relative sound amplitude based on gaze location

    if (voicebalance < .25) {
      soundFileK1Gain.amp(1);
      soundFileL1Gain.amp(1-outputSmile);
      soundFileK2Gain.amp(0);
      soundFileL2Gain.amp(0);
      soundFileK3Gain.amp(0);
      soundFileL3Gain.amp(0);
      soundFileK4Gain.amp(0);
      soundFileL4Gain.amp(0);
    } else if (voicebalance >= .25 && voicebalance < .50) {
      soundFileK1Gain.amp(0);
      soundFileL1Gain.amp(0);
      soundFileK2Gain.amp(1);
      soundFileL2Gain.amp(1-outputSmile);
      soundFileK3Gain.amp(0);
      soundFileL3Gain.amp(0);
      soundFileK4Gain.amp(0);
      soundFileL4Gain.amp(0);
    } else if (voicebalance >= .50 && voicebalance < .75) {
      soundFileK1Gain.amp(0);
      soundFileL1Gain.amp(0);
      soundFileK2Gain.amp(0);
      soundFileL2Gain.amp(0);
      soundFileK3Gain.amp(1);
      soundFileL3Gain.amp(1-outputSmile);
      soundFileK4Gain.amp(0);
      soundFileL4Gain.amp(0);    
    } else {
      soundFileK1Gain.amp(0);
      soundFileL1Gain.amp(0);
      soundFileK2Gain.amp(0);
      soundFileL2Gain.amp(0);
      soundFileK3Gain.amp(0);
      soundFileL3Gain.amp(0);
      soundFileK4Gain.amp(1);
      soundFileL4Gain.amp(1-outputSmile);      
    }

  
    //adjust foreground voices based on proximity
    soundVolume = constrain(outputArea, 0, 1);
    masterGain.amp(soundVolume)
}

function scene9() {
  autoAdvance();
  background(bg_credits);
  soundFileK1.fade(0,1)
  soundFileL1.fade(0,1)
  soundFileK2.fade(0,1)
  soundFileL2.fade(0,1)
  soundFileK3.fade(0,1)
  soundFileL3.fade(0,1)
  soundFileK4.fade(0,1)
  soundFileL4.fade(0,1)
  drawStatic();
}

function scene10() {
  autoAdvance();
  background(bg_credits2);
  drawStatic();
}

function scene11() {
  autoAdvance();
  background(bg_outro);
  soundFileWind.fade(0,1)
  soundFileVoices.fade(0,1)
}
