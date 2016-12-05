import React from 'react';
import { connect } from 'react-redux';

import { fetchData } from '../reducers/getData';
import InputForm from '../components/InputForm';

// parts of store needed by connected component:  entry (data from Firebase, if any)
// and visInfo (visualization info returned from server)
const mapStateToProps = ({ entry, visInfo }) => ({ entry, visInfo });

const mapDispatchToProps = dispatch => ({
  // send user input and title to get data
	postAndGetWordData: (input) => dispatch(fetchData(input))

});

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);

