import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import Navbar from './NavBar';

export default class PlanPage extends Component {
  state = {
    selectedDate: new Date().toLocaleString('en-us',{month:'long', day: 'numeric'})
  }
  render() {
    return (
      <div>
        <div style={{position: 'absolute', left: 500, top: 300}}>
          <Calendar onChange={(e) => this.setState({selectedDate: e.toLocaleString('en-us',{month:'long', day: 'numeric'})})}/>
        </div>
        <h1 style={{position: 'relative', color: 'white', top: 300, left: 880}}>Add Workout to {this.state.selectedDate}</h1>

        <Navbar/>
        <Sidebar/>
      </div>
    );
  }
}
