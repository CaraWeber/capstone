'use strict';
import React from 'react';
import firebase from 'firebase';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import { orange500 } from 'material-ui/styles/colors';

const styles = {
  margin: 12,
  underlineStyle: {
    borderColor: orange500,
  }
};

// the form for user input, which is rendered inside of the Drawer component
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

// submit function, called when user clicks submit button
  submitForm(e) {
    e.preventDefault();

    // validations to make sure necessary input fields are not blank
    var span = document.getElementById("alert");
    if(e.target.graphtitle.value =="" ) {
      span.innerHTML = "Title cannot be null!";

    } else if(e.target.text.value =="") {
        span.innerHTML = "Text cannot be null!";

    } else {
      span.innerHTML = "";
      const { postAndGetWordData } = this.props;

      // constructing the request object to send to the server and Firebase database
      const userInput = {
        text: e.target.text.value,
        title: e.target.graphtitle.value
      };

      // send user input to database
      const myRef = firebase.database().ref('/');
      const newRef = myRef.push(userInput);
      const id = newRef.key;

      // sends request object to server, then dispatches visualization info received back
      // (text data and axis info); dispatches title
      // See function description in InputFormContainer
      postAndGetWordData(userInput);


      // preparing data for Firebase submission
      // if the title already exists, attach random str to the end of the title
      const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
      'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_'];

      const randStr = (length = 5) => {
        Array(length)
          .fill(0)
          .map((x, i) => letters[Math.floor(Math.random() * letters.length)])
          .join('');
      };

      const write = (input, charsToAppend = 0) => {
        const key = charsToAppend
          ? `${input.title}_${randStr(charsToAppend)}`
          : input.title;

        const myRef = firebase.database().ref(key);

        return myRef
          .transaction(existing => existing === null? input : undefined)
          .then(({committed, snapshot}) => {
            if (!committed) {
              return write(input, charsToAppend + 1);
            }
            return key;
          })
      }; // const write
    } // else
  } // end of submitForm

  render() {
    const entry = this.props.entry;
    const labels = this.props.visInfo.labels;
    const title = this.props.visInfo.graphtitle;

    if (labels) {
    return(
    <div id = "inputform">
      <form className='form-inline' onSubmit={this.submitForm }>
        <h4>DETAILS FOR YOUR 3D VISUALIZATION</h4>
        <div className='form-group'>
          {/* user input field: title for text visualization */}
          <TextField hintText="please enter a title for your graph" name='graphtitle' defaultValue={entry.title}/>
        </div>
        <div>
          <p>
            The text you enter is rendered in a 3D-graph where the x, y, and z axes represent the three vectors
            that cause the most variation in your data.
            The three words closest to those axis-defining vectors will display below.  You can think about this
            as the three axes representing the ideas that are most important to your text.  The x-axis represents
            the most important idea, then y, then z.
          </p>
        </div>

        <div>
      {/* render axis labels with data returned from server */}
        { labels &&
       <div>
        <div className='form-group full-width' id="form1" >
          x-axis
         { labels.x && (<p>{labels.x.join(', ')} </p>) }
        </div>
        <div className='form-group full-width' id="form2">
          y-axis
          { labels.y && (<p>{labels.y.join(', ')} </p>) }
        </div>
          <div className='form-group full-width' id="form3">
          z-axis
          { labels.z && (<p>{labels.z.join(', ')} </p>) }
        </div>
        </div>
      }
        </div>
      {/* user input field: text to analyze */}
        <div className='form-group full-width'>
          <TextField
            name='text'
            floatingLabelText="TEXT TO ANALYZE"
            multiLine={true}
            fullWidth={true}
            rows={3}
            rowsMax={3}
            style={{overflow: scroll}}
            defaultValue={entry.text}
          />
        </div>
        <div>
          <span id = "alert" ></span>
        </div>

           <div>
              <RaisedButton type="submit" label="SUBMIT" style={ styles } />
            </div>
            <div>
              <p>
              Navigate your model!  Zoom (two fingers or mousewheel), rotate (click and drag), or move
              model on the screen (two fingers click and drag).  Hover over a sphere to see the word it
              represents.
              </p>
              <p>
              To render a new text model, simply enter a new title & text to analyze.  Button at top
              will close form drawer.
              </p>
            </div>
      </form>

    </div>
    )
   }
  }
}