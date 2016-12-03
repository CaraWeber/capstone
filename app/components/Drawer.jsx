import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import InputFormContainer from '../containers/InputFormContainer'
import GraphicContainer from '../containers/GraphicContainer'
export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <RaisedButton
          label="Toggle Drawer"
          onTouchTap={this.handleToggle}
        />
        <Drawer width={400} openSecondary={true} open={this.state.open} >
          <InputFormContainer />
        </Drawer>
        <GraphicContainer />
      </div>
    );
  }
}