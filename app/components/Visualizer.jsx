import {connect} from 'react-redux';
import React, { Component } from 'react';

import Promise from 'bluebird';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { amber50, amber400, fullWhite, grey50, grey900 } from 'material-ui/styles/colors';

let OrbitControls = require('three-orbit-controls')(THREE);

const styles = {
  position: "absolute",
  minHeight: "50px",
  minWidth: "50px",
  color: amber50,
  transition: "none"
}

export default class Visualizer extends Component {
  constructor(props) {
    super(props);

    // this.stats;
    this.camera;
    this.controls;
    this.scene;
    this.renderer;
    this.animate = this.animate.bind(this);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersected;
    this.mirror = true;
    this.objects = [];
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.onWindowResize = this.onWindowResize.bind(this);
    this.loadWords = this.loadWords.bind(this);
    this.loadTextWords = this.loadTextWords.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    this.props.updateStatus('loading')
    this.initRenderer();
    this.init();
    this.animate();
    window.addEventListener( 'mousemove', this.onMouseMove, false );
    //window.mousemove = this.onMouseMove

    window.addEventListener( 'resize', this.onWindowResize, false );
    window.requestAnimationFrame(this.render);
  }

  componentDidUpdate() {

    this.props.updateStatus('ready');
  }

  /* load the words/label to scene */
  loadWords(words, fontFile, size, height) {
    //need to load the font first
    let loader = new THREE.FontLoader();
    loader.load(fontFile, (font) => {

      //for every word create an object called Mesh
      words && Object.keys(words).forEach((word) => {
        //properties for word
        let geometry  = new THREE.TextGeometry(word,{size, font, height});
        let material =  new THREE.MeshBasicMaterial( { color: 0xffffff } );
        let mesh = new THREE.Mesh( geometry, material );

        //set the position for every single word
        mesh.position.x = words[word][0] - 0.5;
        mesh.position.y = words[word][1] - 0.5;
        mesh.position.z = words[word][2] - 0.5;

        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        //append the word to scene
        this.scene.add( mesh );
      });
    });
  }

  /* load the words/label to scene */
  loadTextWords(compareBool, words, color) {

    //for every word create an object called Mesh
    words && Object.keys(words).forEach((word, idx) => {
      // console.log("inside load text words", idx, word);
    //properties for word
      let geometry  = new THREE.SphereGeometry( 0.005, 8, 8 );

      if(!compareBool){
        if(idx == 0){
          this.x = words[word][0];
          this.y = words[word][1];
          this.z = words[word][2];
        }

        color = new THREE.Color((words[word][0]-this.x)*10,
        (words[word][1]-this.y)*10,
        (words[word][2]-this.z)*10);
      }

      let material =  new THREE.MeshLambertMaterial( { color: color} );
      let mesh = new THREE.Mesh( geometry, material );

      //set the position for every single word
      /**** change range to 0 to 1 in camera (i.e. set positions to the word coordinate values) ****/
      mesh.position.x = words[word][0] - 0.5;
      mesh.position.y = words[word][1] - 0.5;
      mesh.position.z = words[word][2] - 0.5;

      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      mesh.name = words[word]; // hopefully can use this for "mouse over" word info!
      //passing down the properiteis, word & color
      mesh.word = word;
      mesh.colors =[(words[word][0]-this.x)*10,
        (words[word][1]-this.y)*10,
        (words[word][2]-this.z)*10]
      this.objects.push(mesh);
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

    //the view from the userwindow.innerWidth / window.innerHeight
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 10000 );
    this.camera.position.z = 1.3;

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

    //info box to monitor code performance
    // this.stats = new Stats();
    // container.appendChild( this.stats.dom );

    // load everything onto the scene
    this.loadWords(this.props.labels, 'js/optimer_bold.typeface.json', 0.03, 0.005);

    // check if the text2 exists, if so check the length of its object keys,
    // if greater than 1, then we have a second set of text to load
    if(this.props.words.text2 && (Object.keys(this.props.words.text2).length > 1)) {
      this.loadTextWords(true, this.props.words.text1, 0x00ffff);
      this.loadTextWords(true, this.props.words.text2, 0xff3300);
      console.log("this.props.text2++++++++++++", this.props.words.text2);

    } else {
      this.loadTextWords(false, this.props.words.text1);
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
    // update the picking ray with the camera and mouse position
    this.renderer.render( this.scene, this.camera );

  }

  //hover function
  onMouseMove( event ) {
      event.preventDefault();
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components window.innerHeight
      this.mouse.x = ( (event.clientX) /  window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( (event.clientY-50) / document.getElementById("container").offsetHeight) * 2 + 1;

      this.raycaster.setFromCamera( this.mouse, this.camera );
      // calculate objects intersecting the picking ray
      var intersections;
      var numObjects;
      intersections = this.raycaster.intersectObjects( this.objects );
      numObjects = this.objects.length;
      if ( intersections.length > 0 ) {
        if ( this.intersected != intersections[ 0 ].object ) {
          if ( this.intersected ) this.intersected.material.color.setRGB(this.intersected.colors[0],this.intersected.colors[1],this.intersected.colors[2]);
          //get the hover word
          this.intersected = intersections[ 0 ].object;
          //change the color when hover
          this.intersected.material.color.setHex( 0xffffff);
          //add the text
          var text = document.getElementById("text");
          text.innerHTML = this.intersected.word.toUpperCase();
          document.getElementById('container').appendChild(text);
        }
        document.body.style.cursor = 'pointer';
      }
      else if ( this.intersected ) {
        //change the color back
        this.intersected.material.color.setRGB(this.intersected.colors[0],this.intersected.colors[1],this.intersected.colors[2]);
        this.intersected = null;
        //reset the text
        var text = document.getElementById("text");
        text.innerHTML = "";
        document.body.style.cursor = 'auto';
      }
    }

  render () {
    if(this){
        this.scene && this.init(); // clear scene before adding new words/labels to it
        console.log("this.props inside the visualizer renderer", this);
        // 'this' is sometimes undefined
        return (
          <div id="container">
            <h1 id="graph-title">{ this.props.graphtitle }</h1>
          </div>
        );
      }
  }
}
