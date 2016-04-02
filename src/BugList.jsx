'use strict'

import React from 'react'
import {Link} from 'react-router'

import BugFilter from './BugFilter.jsx'
import BugAdd from './BugAdd.jsx'

/*
 * BugRow and BugTable are stateless, so they can be defined as pure functions
 * that only render. Both the following do the same, but with slightly different
 * styles.
 */
const BugRow = (props) => (
  <tr>
    <td>
      {/* Using ES6 string templates feature */}
      <Link to={`/bugs/${props.bug._id}`}>{props.bug._id}</Link>
    </td>
    <td>{props.bug.title}</td>
    <td>{props.bug.owner}</td>
    <td>{props.bug.status}</td>
    <td>{props.bug.priority}</td>
  </tr>
)

function BugTable(props) {
  //console.log("Rendering bug table, num items:", props.bugs.length);
  let bugRows = props.bugs.map((bug, i) => <BugRow key={i} bug={bug} />)
  return (
    <table className="table table-striped table-bordered table-condensed">
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>{bugRows}</tbody>
    </table>
  )
}

export default class BugList extends React.Component {
  constructor() {
    super()
    /* Using ES6 way of intializing state */
    this.state = {bugs: []}
    /* no auto-binding. This is the recommended way, since it is bound only once per instance. */
    this.addBug = this.addBug.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    /* Not required for loadData() since that's never called from an event, only from
     * already bound methods */
  }

  /*
   * In ES6, static members can only be functions. What we're doing here is to define
   * an accessor, so that it appears as a member to its callers.
   */
  static get contextTypes() { return {router: React.PropTypes.object.isRequired} }

  render() {
    console.log("Rendering BugList, num items:", this.state.bugs.length)
    return (
      <div>
        <h1>Bug Tracker</h1>
        <BugFilter submitHandler={this.changeFilter} initFilter={this.props.location.query}/>
        <BugTable bugs={this.state.bugs}/>
        <BugAdd addBug={this.addBug} />
      </div>
    )
  }

  componentDidMount() {
    console.log("BugList: componentDidMount")
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    let oldQuery = prevProps.location.query
    let newQuery = this.props.location.query
    if (oldQuery.priority === newQuery.priority &&
        oldQuery.status === newQuery.status) {
      console.log("BugList: componentDidUpdate, no change in filter, not updating")
      return
    } else {
      console.log("BugList: componentDidUpdate, loading data with new filter")
      this.loadData()
    }
  }

  loadData() {
    fetch('/api/bugs/' + this.props.location.search).then((response) => {
      return response.json()
    }).then((data) => {
      this.setState({bugs: data})
    })
    // In production, we'd also handle errors using catch()
  }

  changeFilter(newFilter) {
    /*
     * 1.x of react-router does not support context.router. We'll need to do it
     * this way if we're using an earlier version of the react-router:
     *   this.props.history.push({search: '?' + $.param(newFilter)})
     */

    // jQuery.param would have done this in one line for us.
    let search = Object.keys(newFilter)
    .filter(k => (newFilter[k]!=''))
    .map(k => (encodeURIComponent(k) + "=" + encodeURIComponent(newFilter[k])))
    .join('&')

    this.context.router.push({search: '?' + search})
    //this.context.router.push({search: '?' + $.param(newFilter)})
  }

  addBug(bug) {
    console.log("Adding bug:", bug)

    fetch('/api/bugs', {
      method: 'POST',
      headers: { "Content-Type": 'application/json' },
      body: JSON.stringify(bug)

    }).then(res => (res.json())).then(bug => {
      /*
       * We should not modify the state, it's immutable. So, we make a copy.
       * A deep copy is not required, since we are not modifying any bug. We are
       * only appending to the array, but we can't do a 'push'. If we do that,
       * any method referring to the current state will get wrong data.
       */
      let bugsModified = this.state.bugs.concat(bug)
      this.setState({bugs: bugsModified})

    }).catch(err => {
      // ideally, show error to user.
      console.log("Error adding bug:", err)
    });
  }
}

/*
 * This is another way to define static properties instead of an accessor.
BugList.contextTypes = {
   router: React.PropTypes.object.isRequired
}
*/

