import React from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';

import BugFilter from './BugFilter.jsx';
import BugAdd from './BugAdd.jsx';

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
);

BugRow.propTypes = {
  bug: React.PropTypes.object.isRequired,
};

function BugTable(props) {
  // console.log("Rendering bug table, num items:", props.bugs.length);
  let bugRows = props.bugs.map((bug, i) => <BugRow key={i} bug={bug} />);
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
  );
}

BugTable.propTypes = {
  bugs: React.PropTypes.array.isRequired,
};

export default class BugList extends React.Component {
  /*
   * In ES6, static members can only be functions. What we're doing here is to define
   * an accessor, so that contextTypes appears as a member variable to its callers.
   * It's anyway a const so we don't need a setter.
   */
  static get contextTypes() {
    return { router: React.PropTypes.object.isRequired };
  }

  static get propTypes() {
    return { location: React.PropTypes.object.isRequired };
  }

  constructor() {
    super();
    /*
     * Using ES6 way of intializing state
     */
    this.state = { bugs: [] };
    /*
     * React on ES6 has no auto-binding. We have to bind each class method. Doing it in
     * the constructor is the recommended way, since it is bound only once per instance.
     * No need to bind loadData() since that's never called from an event, only from other
     * methods which are already bound.
     */
    this.addBug = this.addBug.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }

  componentDidMount() {
    console.log('BugList: componentDidMount');
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.query;
    const newQuery = this.props.location.query;
    // todo: comparing shallow objects -- better way?
    // todo: when do we get called even when there's no change?
    if (oldQuery.priority === newQuery.priority &&
        oldQuery.status === newQuery.status) {
      console.log('BugList: componentDidUpdate, no change in filter, not updating');
      return;
    }
    console.log('BugList: componentDidUpdate, loading data with new filter');
    this.loadData();
  }

  loadData() {
    fetch(`/api/bugs/${this.props.location.search}`).then(response =>
      response.json()
    ).then(bugs => {
      this.setState({ bugs });
    }).catch(err => {
      console.log(err);
      // In a real app, we'd inform the user as well.
    });
  }

  changeFilter(newFilter) {
    /*
     * 1.x of react-router does not support context.router. We'll need to do it
     * this way if we're using an earlier version of the react-router:
     *   this.props.history.push({search: '?' + $.param(newFilter)})
     */

    /*
     * jQuery.param would have done this in one line for us, but we don't want
     * to include the entire library for just this.
     */
    const search = Object.keys(newFilter)
      .filter(k => newFilter[k] !== '')
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(newFilter[k])}`)
      .join('&');

    this.context.router.push({ search: `?${search}` });
  }

  addBug(newBug) {
    console.log('Adding bug:', newBug);

    fetch('/api/bugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBug),

    }).then(res => res.json()).then(bug => {
      /*
       * We should not modify the state directly, it's immutable. So, we make a copy.
       * A deep copy is not required, since we are not modifying any bug. We are
       * only appending to the array, but we can't do a 'push'. If we do that,
       * any method referring to the current state will get wrong data.
       * In essence, the current state should show the old list of bugs, but the
       * new state should show the new list.
       */
      // let modifiedBugs = this.state.bugs.concat(bug);
      /*
       * Earlier, we were supposed to use import react/addons, which is now deprecated
       * in favour of using import react-addons-{addon}, since this is more efficient
       * for bundlers such as browserify and webpack, even though the code mostly resides
       * within the react npm itself.
       */
      const modifiedBugs = update(this.state.bugs, { $push: [bug] });
      this.setState({ bugs: modifiedBugs });

    }).catch(err => {
      // ideally, show error to user also.
      console.log('Error adding bug:', err);
    });
  }

  render() {
    console.log('Rendering BugList, num items:', this.state.bugs.length);
    return (
      <div>
        <h1>Bug Tracker</h1>
        <BugFilter submitHandler={this.changeFilter} initFilter={this.props.location.query} />
        <BugTable bugs={this.state.bugs} />
        <BugAdd addBug={this.addBug} />
      </div>
    );
  }
}

