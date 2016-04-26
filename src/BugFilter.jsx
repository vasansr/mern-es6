import React from 'react';
import { Panel, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, ButtonToolbar }
  from 'react-bootstrap';

export default class BugFilter extends React.Component {
  static get propTypes() {
    return {
      initFilter: React.PropTypes.object.isRequired,
      submitHandler: React.PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      status: this.props.initFilter.status,
      priority: this.props.initFilter.priority,
    };
    this.submit = this.submit.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.initFilter.status === this.state.status
        && newProps.initFilter.priority === this.state.priority) {
      console.log('BugFilter: componentWillReceiveProps, no change');
      return;
    }
    console.log('BugFilter: componentWillReceiveProps, new filter:', newProps.initFilter);
    this.setState({ status: newProps.initFilter.status, priority: newProps.initFilter.priority });
  }

  onChangeStatus(e) {
    this.setState({ status: e.target.value });
  }

  onChangePriority(e) {
    this.setState({ priority: e.target.value });
  }

  submit(e) {
    e.preventDefault();
    const newFilter = {};
    if (this.state.priority) newFilter.priority = this.state.priority;
    if (this.state.status) newFilter.status = this.state.status;
    this.props.submitHandler(newFilter);
  }

  render() {
    console.log('Rendering BugFilter, state=', this.state);
    return (
      <Panel collapsible defaultExpanded header="Filter">
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={4}>
              <FormGroup>
                <ControlLabel>Priority</ControlLabel>
                <FormControl componentClass="select" value={this.state.priority}
                  onChange={this.onChangePriority}>
                  <option value="">(Any)</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <FormGroup>
                <ControlLabel>Status</ControlLabel>
                <FormControl componentClass="select" value={this.state.status}
                  onChange={this.onChangeStatus}>
                  <option value="">(Any)</option>
                  <option>New</option>
                  <option>Open</option>
                  <option>Closed</option>
                </FormControl>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <FormGroup>
                <ControlLabel>&nbsp;</ControlLabel>
                <ButtonToolbar>
                  <Button type="submit" bsStyle="primary" onClick={this.submit}>Submit</Button>
                </ButtonToolbar>
              </FormGroup>
            </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}
