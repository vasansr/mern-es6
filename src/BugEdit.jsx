'use strict'

import React from 'react'
import {Link} from 'react-router'

import {Panel, Input, Button, ButtonToolbar, Alert} from 'react-bootstrap'

export default class BugEdit extends React.Component {

  render() {
    let success = (
      <Alert bsStyle="success" onDismiss={this.dismissSuccess} dismissAfter={5000}>
        Bug saved to DB successfully.
      </Alert>
    )
    return (
      <div style={{maxWidth: 600}}>
        <Panel header={"Edit bug: " + this.props.params.id}>
          <form onSubmit={this.submit}>
            <Input type="select" name="priority" label="Priority"
              value={this.state.priority} onChange={this.onChange}>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </Input>
            <Input type="select" name="status" label="Status" value={this.state.status}
              onChange={this.onChange}>
              <option>New</option>
              <option>Open</option>
              <option>Closed</option>
            </Input>
            <Input type="text" name="title" label="Title" value={this.state.title}
              onChange={this.onChange}/>
            <Input type="text" name="owner" label="Owner" value={this.state.owner}
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
    this.showSuccess = this.showSuccess.bind(this)
    this.dismissSuccess = this.dismissSuccess.bind(this)

    this.state = {successVisible: false}
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
    fetch('/api/bugs/' + this.props.params.id).then((response) => {
      return response.json()
    }).then((bug) => {
      this.setState(bug)    // all the attributes of the bug are top level state items
    })
  }

  // todo: react-addons/update or other immutability helpers.
  onChange(e) {
    var item = {};
    item[e.target.name] = e.target.value;
    this.setState(item)
  }

  showSuccess() {
    this.setState({successVisible: true})
  }
  dismissSuccess() {
    this.setState({successVisible: false})
  }

  submit(e) {
    e.preventDefault()
    // todo: separate bug into a sub-object, use Object.assign and babel-plugin-object-assign
    var bug = {
      status: this.state.status,
      priority: this.state.priority,
      owner: this.state.owner,
      title: this.state.title
    }

    fetch('/api/bugs/' + this.props.params.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bug)

    }).then(response => response.json()).then(bug => {
      this.setState(bug);
      this.showSuccess();
    });
  }
}

