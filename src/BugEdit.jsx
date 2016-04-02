'use strict'

import React from 'react'
import {Link} from 'react-router'
import $ from 'jquery'

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
            <Input type="select" label="Priority"
              value={this.state.priority} onChange={this.onChangePriority}>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </Input>
            <Input type="select" label="Status" value={this.state.status}
              onChange={this.onChangeStatus}>
              <option>New</option>
              <option>Open</option>
              <option>Closed</option>
            </Input>
            <Input type="text" label="Title" value={this.state.title}
              onChange={this.onChangeTitle}/>
            <Input type="text" label="Owner" value={this.state.owner}
              onChange={this.onChangeOwner}/>
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
    this.onChangePriority = this.onChangePriority.bind(this)
    this.onChangeStatus = this.onChangeStatus.bind(this)
    this.onChangeTitle = this.onChangeTitle.bind(this)
    this.onChangeOwner = this.onChangeOwner.bind(this)
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
    $.ajax('/api/bugs/' + this.props.params.id) .done(function(bug) {
      this.setState(bug)
    }.bind(this))
  }

  onChangePriority(e) {
    this.setState({priority: e.target.value})
  }
  onChangeStatus(e) {
    this.setState({status: e.target.value})
  }
  onChangeOwner(e) {
    this.setState({owner: e.target.value})
  }
  onChangeTitle(e) {
    this.setState({title: e.target.value})
  }

  showSuccess() {
    this.setState({successVisible: true})
  }
  dismissSuccess() {
    this.setState({successVisible: false})
  }

  submit(e) {
    e.preventDefault()
    var bug = {
      status: this.state.status,
      priority: this.state.priority,
      owner: this.state.owner,
      title: this.state.title
    }

    $.ajax({
      url: '/api/bugs/' + this.props.params.id, type: 'PUT', contentType:'application/json',
      data: JSON.stringify(bug),
      dataType: 'json',
      success: function(bug) {
        this.setState(bug)
        this.showSuccess()
      }.bind(this),
    })
  }
}

