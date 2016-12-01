'use strict';
import React from 'react'
import axios from 'axios'
import {browserHistory} from 'react-router'
import firebase from 'firebase'

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {orange500, blue500} from 'material-ui/styles/colors';
import { loadLabels } from '../reducers/inputForm'
injectTapEventPlugin();
const styles = {
  margin: 12,
  underlineStyle: {
    borderColor: orange500,
  }
};

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {xmin: [], ymin: [], zmin: [], xmax: [], ymax: [], zmax: []};
    this.submitForm = this.submitForm.bind(this)
  }

  submitForm(e) {

    e.preventDefault()

    const { addTitle,addLabels, postAndGetWordData } = this.props;

    var xmin = e.target.xmin.value.split(" ");
    var xmax = e.target.xmax.value.split(" ");
    var ymin = e.target.ymin.value.split(" ");
    var ymax = e.target.ymax.value.split(" ");
    var zmin = e.target.zmin.value.split(" ");
    var zmax = e.target.zmax.value.split(" ");

    const userInput = {
      x: [xmin, xmax],
      y: [ymin, ymax],
      z: [zmin, zmax],
      text: e.target.text.value,
      title: e.target.graphtitle.value,
      ts: firebase.database.ServerValue.TIMESTAMP,
    }

    // y: [e.target.ymin.value.trim(), e.target.ymax.value.trim()],
    // myRef is how we can access table in firebase
    // userInput is an object derived from user's text entries which will be a) sent to database table
    // and b) sent to python server to be converted into plottable points

    // if the title already exists, attach random str to the end of the title
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_']
    const randStr = (length=5) =>
      Array(length)
        .fill(0)
        .map((x, i) => letters[Math.floor(Math.random() * letters.length)])
        .join('')

    const write = (input, charsToAppend=0) => {
      const key = charsToAppend
        ? `${input.title}_${randStr(charsToAppend)}`
        : input.title
      const myRef = firebase.database().ref(key);
      return myRef
        .transaction(existing => existing === null? input : undefined)
        .then(({committed, snapshot}) => {
          if (!committed) {
            return write(input, charsToAppend + 1)
          }
          return key
        })
    }

    //const newRef = myRef.push(userInput);     // send user input to database

    const newRef = write(userInput).catch(console.error)

    const id = newRef.key;
    console.log("ID FROM FIREBASE", id);
    // this is the database key for entry just pushed

    console.log("title----",e.target.graphtitle.value);
    addTitle(e.target.graphtitle.value);
    addLabels(userInput);
    postAndGetWordData(userInput)      // call function to post request to python server
      //.then(browserHistory.push('/tmp'));         // redirect to visualizer
  }


  render() {
    const entry = this.props.entry
    return(
    <form className='form-inline' onSubmit={this.submitForm }>
      <h4>DETAILS FOR YOUR 3D VISUALIZATION</h4>
      <div className='form-group'>

        <TextField hintText="please enter a title for your graph" name='graphtitle' value={entry.title}/>
      </div>
      <div>
        <p>
          Below, enter the key words that will mark the endpoints for the axes on your graphs.  You
          can enter just one word per endpoint, but you will probably get better results if you enter
          several related words for each endpoint.
        </p>
      </div>
      <div className='form-group full-width'>
        <TextField className='axis-labels' floatingLabelText="x-min; separate words with a space" name='xmin' value={entry.x[0]}/>
        <TextField className='axis-labels' floatingLabelText="x-max; separate words with a space" name='xmax' value={entry.x[1]}/>
      </div>
      <div className='form-group full-width'>
        <TextField className='axis-labels' floatingLabelText="y-min; separate words with a space" name='ymin' value={entry.y[0]}/>
        <TextField className='axis-labels' floatingLabelText="y-max; separate words with a space" name='ymax' value={entry.y[1]}/>
      </div>
        <div className='form-group full-width'>
        <TextField className='axis-labels' floatingLabelText="z-min; separate words with a space" name='zmin' value={entry.z[0]}/>
        <TextField className='axis-labels' floatingLabelText="z-max; separate words with a space" name='zmax' value={entry.z[1]}/>
      </div>
      <div className='form-group full-width'>
        <TextField
          name='text'
          floatingLabelText="TEXT TO ANALYZE"
          multiLine={true}
          fullWidth ={true}
          rows={6}
          rowsMax={6}
          style = {{overflow: scroll}}
          value={entry.text}
        />
      </div>
      <div>
        <RaisedButton type="submit" label="SUBMIT" style={styles} />
      </div>
    </form>)
  }

}