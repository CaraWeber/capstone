import React from 'react';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import NavbarContainer from '../containers/NavbarContainer';

export default class App extends React.Component {
	constructor(props) {
		super(props);
        injectTapEventPlugin();		
	}
	
	render() {
		return (
			<div>
		      	<NavbarContainer />
	        	{ this.props.children }
	        </div>
		);
	}
}