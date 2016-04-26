import React from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';

import { Panel, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar, Alert }
  from 'react-bootstrap';

export default class BugEdit extends React.Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    this.state = { successVisible: false, bug: {} };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    console.log('BugEdit: componentDidUpdate', prevProps.params.id, this.props.params.id);
    if (this.props.params.id !== prevProps.params.id) {
      this.loadData();
    }
  }

  onChange(e) {
    /*
     * Since state is immutable, we need a copy. If we modify this.state.bug itself and
     * set it as the new state, It will seem to work, but we'll
     * run into problems later, especially when comparing current and new state
     * within Lifecycle methods.
     */
    const changes = {};
    changes[e.target.name] = { $set: e.target.value };
    const modifiedBug = update(this.state.bug, changes);
    /*
     * Without react-addons-update, this is how it could have been achieved:
     *
    var modifiedBug = Object.assign({}, this.state.bug);
    modifiedBug[e.target.name] = e.target.value;
     *
     * This works, but it doesn't scale well to deeply nested fields within the document.
     *
    */

    this.setState({ bug: modifiedBug });
  }

  loadData() {
    fetch(`/api/bugs/${this.props.params.id}`).then(response => response.json()).then(bug => {
      this.setState({ bug });    // all the attributes of the bug are top level state items
    });
  }

  submit(e) {
    e.preventDefault();

    fetch(`/api/bugs/${this.props.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.bug),

    }).then(response => response.json()).then(bug => {
      this.setState({ bug });
      this.setState({ successVisible: true });
      this.dismissTimer = setTimeout(this.dismissAlert, 5000);
    });
  }

  dismissAlert() {
    this.setState({ successVisible: false });
  }

  render() {
    const success = (
      <Alert bsStyle="success" onDismiss={this.dismissAlert} >
        Bug saved to DB successfully.
      </Alert>
    );
    const bug = this.state.bug;
    return (
      <div style={{ maxWidth: 600 }}>
        <Panel header={`Edit bug: ${this.props.params.id}`}>
          <form onSubmit={this.submit}>
            <FormGroup>
              <ControlLabel>Priority</ControlLabel>
              <FormControl componentClass="select" name="priority" value={bug.priority}
                onChange={this.onChange}>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Status</ControlLabel>
              <FormControl componentClass="select" name="status" value={bug.status}
                onChange={this.onChange}>
                <option>New</option>
                <option>Open</option>
                <option>Closed</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl type="text" name="title" value={bug.title} onChange={this.onChange} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Owner</ControlLabel>
              <FormControl type="text" name="owner" value={bug.owner}
                onChange={this.onChange} />
            </FormGroup>
            <ButtonToolbar>
              <Button type="submit" bsStyle="primary">Submit</Button>
              <Link className="btn btn-link" to="/bugs">Back</Link>
            </ButtonToolbar>
          </form>
        </Panel>
        {this.state.successVisible ? success : null}
      </div>
    );
  }
}

BugEdit.propTypes = {
  params: React.PropTypes.object.isRequired,
};

