'use strict'

import React from 'react'

import {Panel,Input,ButtonInput} from  'react-bootstrap'

export default class BugAdd extends React.Component {
  constructor(props) {
    super(props)
    // no auto-binding. This is the recommended way, since it is bound only once per instance.
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    //console.log("Rendering BugAdd")
    return (
      <Panel header="Add Bug">
        <form name="bugAdd">
          <Input type="text" name="title" label="Bug Title" />
          <Input type="text" name="owner" label="Owner" />
          <ButtonInput value="Add" bsStyle="primary" onClick={this.handleSubmit} />
        </form>
      </Panel>
    )
  }

  handleSubmit(e) {
    console.log("Got submit:", e)
    e.preventDefault()
    // todo: change this to Input.getInputDOMNode()
    // This can't be a stateless since we'll need a ref for inputDomNode
    var form = document.forms.bugAdd
    this.props.addBug({owner: form.owner.value, title: form.title.value,
                      status: 'New', priority: 'P1'})
    // clear the form for the next input
    form.owner.value = ""; form.title.value = "";
  }
}

