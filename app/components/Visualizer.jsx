import {connect} from 'react-redux'
import React, { Component } from 'react';

let OrbitControls = require('three-orbit-controls')(THREE);

export default class Visualizer extends Component {
  constructor(props) {
    super(props);

    // this.stats;
    this.camera;
    this.controls;
    this.scene;
    this.renderer;
    this.animate = this.animate.bind(this);

    this.mirror = true;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.loadWords = this.loadWords.bind(this);
    this.loadTextWords = this.loadTextWords.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    
  
  }

  componentDidMount() {
    this.initRenderer();
      this.init();

      this.animate();
    //   console.log("the scene before", this.scene);
    // this.scene && this.scene.children.forEach((object) => {
    //     this.scene.remove(object);
    // });
    // console.log("the scene after", this.scene);
      // this.props.getCompareSample();
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("the scene before", this.scene);
  //   this.scene.children.forEach((object) => {
  //       this.scene.remove(object);
  //   });
  //   console.log("the scene after", this.scene);
  // }

  componentDidUpdate() {
    this.init();

    const canv = document.getElementsByTagName("canvas")
    console.log(canv, "CANVVVVVVVV");
    canv[0] &&
    canv[0].addEventListener("click", () => canv[0].webkitRequestFullscreen())
  }

  /* load the words/label to scene */
  loadWords(words, fontFile, size, height) {
    //need to load the font first
    let loader = new THREE.FontLoader();
    loader.load(fontFile, (font) => {
      console.log("here",words);
      //for every word create an object called Mesh
      words && Object.keys(words).forEach((word) => {
        //properties for word
        let geometry  = new THREE.TextGeometry(word,{size, font, height});
        let color = new THREE.Color(words[word][0], words[word][1], words[word][2]);
        let material =  new THREE.MeshBasicMaterial( { color: 0xffffff } );
        let mesh = new THREE.Mesh( geometry, material );

        //set the position for every single word
        mesh.position.x = ((words[word][0] - 0.7) * window.innerWidth);
        mesh.position.y = ((words[word][1] - 0.5) * window.innerHeight);
        mesh.position.z = ((words[word][2] - 0.7) * 500);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        //append the word to scene
        this.scene.add( mesh );
      })
    })
  }

  /* load the words/label to scene */
  loadTextWords(compareBool, words, color) {
    console.log("inside load text words", compareBool, words, color);
    
      let x = 0, y = 0, z = 0;
     //for every word create an object called Mesh
      words && Object.keys(words).forEach((word, idx) => {
        //properties for word
        let geometry  = new THREE.SphereGeometry( 5, 8, 8 );


        if(!compareBool){
          // console.log("herwerwerwer");
          if(idx == 0){
            x = words[word][0];
            y = words[word][1];
            z = words[word][2];
          }
          // console.log(x, y, z, idx);

          color = new THREE.Color((words[word][0]-x)*10, 
            (words[word][1]-y)*10, 
            (words[word][2]-z)*10);

        }

        let material =  new THREE.MeshLambertMaterial( { color: color} );
        let mesh = new THREE.Mesh( geometry, material );

        //set the position for every single word
        /**** change range in camera ****/
        mesh.position.x = ((words[word][0] - 0.7) * window.innerWidth);
        mesh.position.y = ((words[word][1] - 0.5) * window.innerHeight);
        mesh.position.z = ((words[word][2] - 0.7) * 700);

        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        mesh.name = words[word]; // hopefully can use this for "mouse over" word info!
        //append the word to scene
        this.scene.add( mesh );
      })
    }

    initRenderer() {

    //to display the scene, create new renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    let container = document.getElementById( 'container' );
    container.appendChild( this.renderer.domElement );
    }

 init() {
    console.log("INIT FUN");
    // create the scene to contain 3d modules
    this.scene = new THREE.Scene();

    
    //the view from the user
    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 800;
    this.camera.translateZ(-180);

    //orbit around some object
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    // lights
    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    this.scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    this.scene.add( light );
    // light = new THREE.AmbientLight( 0xffffff );
    // this.scene.add( light );

    //info box to monitor code performance
    // this.stats = new Stats();
    // container.appendChild( this.stats.dom );

    // should only be attached once
    window.addEventListener( 'resize', this.onWindowResize, false );

    this.loadWords(this.props.labels, 'js/optimer_bold.typeface.json', 35, 5);
      
    if(this.props.compare === "true")  {
      this.loadTextWords(true, this.props.words, 0x00ffff);
      this.loadTextWords(true, this.props.text2, 0xff3300);
    } else {
      this.loadTextWords(false, this.props.words);
    }
  }

  // auto resize
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  // animation
  animate() {
    requestAnimationFrame( this.animate );
    this.controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    // this.stats.update();
    this.renderPlot();
  }

  //plot the scene and camera to the canvas
  renderPlot() {
    this.renderer.render( this.scene, this.camera );
  }

  render () {
    let counter = 0;
    // if(this.scene) {
    //   // console.log("load info in visualizer", this.props.loadinfo);
    //   // if(this.props.clearSceneBool) {
    //   //   console.log("the scene before", this.scene);
    //   //   for(let i = this.scene.children.length; i >= 0; --i) {
    //   //     obj = this.scene.children[i];
    //   //     if(obj.type === "Mesh") {
    //   //       obj.material.dispose();
    //   //       obj.geometry.dispose();
    //   //       this.scene.remove(obj);
    //   //     }
    //   //   }


    //     // this.scene.children.forEach((object) => {
    //     //   if(object.type === "Mesh") {
    //     //     ++counter;
    //     //   // console.log("object is .........", object);
    //     //     object.material.dispose();
    //     //     object.geometry.dispose();

    //     //     this.scene.remove(object);
    //     //   } else {
    //     //     console.log(" otherwise this is not deleted", object.type);
    //     //   }
    //     // });

    //     // this.props.clearScene(false);
    //     console.log("the scene after", this.scene, counter);
    //   } else {
        console.log("load words and labelse")
      // load all words for each scene
      console.log("this scene in render", this.scene);
      console.log("this.props inside visualizer render", this.props);

    // }
    

    return (
      <div id="container">
        <h1>{ this.props.graphtitle }</h1>
      </div>
    )
  }
}
