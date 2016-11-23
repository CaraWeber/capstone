import React from 'react'
import { connect } from 'react-redux'
import {getWords} from '../reducers/visualizer'
import axios from 'axios'

import InputForm from '../components/InputForm'

const mapStateToProps = (state) => ({

})


const mapDispatchToProps = dispatch => ({
	addLabels: () => {
		const action = loadLabel();
		dispatch(action);
	},
	postAndGetWordData: (input) => {                        // axios call to python server
    return axios.post('http://localhost:1337', input)    	   // returns the plottable points 
      .then(res => dispatch(getWords(res.data)))
      .catch(err => console.error(err))
  	}
});

export default connect(null, mapDispatchToProps)(InputForm)
