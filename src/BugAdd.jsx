import React from 'react';
import { Panel, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

/*
 * Todo: convert this to a modal
 */
export default class BugAdd extends React.Component {
  constructor(props) {
    super(props);
    // no auto-binding. This is the recommended way, since it is bound only once per instance.
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    console.log('Got submit:', e);
    e.preventDefault();
    // This can't be a stateless since we'll need a ref for inputDomNode
    // Can't do getInputDOMNode using a ref, because there's no way to set the value
    // That's why one should prefer controlled forms.
    const form = document.forms.bugAdd;
    this.props.addBug({ owner: form.owner.value, title: form.title.value,
                      status: 'New', priority: 'P1' });
    // clear the form for the next input
    form.owner.value = ''; form.title.value = '';
  }

  render() {
    console.log('Rendering BugAdd');
    return (
      <Panel header="Add Bug">
        <form name="bugAdd">
          <FormGroup>
            <ControlLabel>But Title</ControlLabel>
            <FormControl type="text" name="title" />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Owner</ControlLabel>
            <FormControl type="text" name="owner" label="Owner" />
          </FormGroup>
          <Button bsStyle="primary" onClick={this.handleSubmit}>Add</Button>
        </form>
      </Panel>
    );
  }
}

BugAdd.propTypes = {
  addBug: React.PropTypes.func.isRequired,
};
