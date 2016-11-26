import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './accountsUiWrapper.jsx';
 
// App component - represents the whole app
class App extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
        hideCompleted: false,
      };
    }

    handleSubmit(event) {
        event.preventDefault();
 
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    
    Meteor.call('tasks.insert', text);
    
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
      this.setState({
        hideCompleted: !this.state.hideCompleted,
      });
    }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Meteor Todo List ({this.props.incompleteCount})</h1>

            <label className="hide-completed">
              <input
                type="checkbox"
                readOnly
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Completed Tasks
          </label>

          <AccountsUIWrapper />
            
          {/* The form is going to allow me to add new tasks */}
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>
        
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);

