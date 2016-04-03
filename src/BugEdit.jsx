'use strict'

import React from 'react'
import {Link} from 'react-router'

import {Panel, Input, Button, ButtonToolbar, Alert} from 'react-bootstrap'

export default class BugEdit extends React.Component {

  render() {
    let success = (
      <Alert bsStyle="success" onDismiss={() => {this.setState({successVisible: false})}}
        dismissAfter={5000}>
        Bug saved to DB successfully.
      </Alert>
    )
    let bug = this.state.bug;
    return (
      <div style={{maxWidth: 600}}>
        <Panel header={"Edit bug: " + this.props.params.id}>
          <form onSubmit={this.submit}>
            <Input type="select" name="priority" label="Priority"
              value={bug.priority} onChange={this.onChange}>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </Input>
            <Input type="select" name="status" label="Status" value={bug.status}
              onChange={this.onChange}>
              <option>New</option>
              <option>Open</option>
              <option>Closed</option>
            </Input>
            <Input type="text" name="title" label="Title" value={bug.title}
              onChange={this.onChange}/>
            <Input type="text" name="owner" label="Owner" value={bug.owner}
              onChange={this.onChange}/>
            <ButtonToolbar>
              <Button type="submit" bsStyle="primary">Submit</Button>
              <Link className="btn btn-link" to="/bugs">Back</Link>
            </ButtonToolbar>
          </form>
        </Panel>
        {this.state.successVisible ? success : null}
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.onChange = this.onChange.bind(this)

    this.state = {successVisible: false, bug: {}}
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    console.log("BugEdit: componentDidUpdate", prevProps.params.id, this.props.params.id)
    if (this.props.params.id != prevProps.params.id) {
      this.loadData()
    }
  }

  loadData() {
    fetch('/api/bugs/' + this.props.params.id).then(response => {
      return response.json()
    }).then(bug => {
      this.setState({bug: bug})    // all the attributes of the bug are top level state items
    })
  }

  // todo: react-addons/update or other immutability helpers, to deal with
  // nested objects / arrays.
  onChange(e) {
    // Since state is immutable, we need a copy. If we modify this.state.bug itself and
    // set it as the new state, It will seem to work, but you'll
    // run into problems later, especially when comparing current and new state
    // within Lifecycle methods.
    var bug = Object.assign({}, this.state.bug);
    bug[e.target.name] = e.target.value;
    this.setState({bug: bug})
  }

  submit(e) {
    e.preventDefault()
    var bug = this.state.bug;

    fetch('/api/bugs/' + this.props.params.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bug)

    }).then(response => response.json()).then(bug => {
      this.setState({bug: bug});
      this.setState({successVisible: true});
    });
  }
}

