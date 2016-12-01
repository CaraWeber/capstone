import React from 'react'
import { connect } from 'react-redux'
import NavbarContainer from '../containers/NavbarContainer'
import AppBarExampleComposition from './Navbar2';
import injectTapEventPlugin from 'react-tap-event-plugin';


// export default (

//   ({ children }) =>{
//       }
// )

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
		)
	}
}