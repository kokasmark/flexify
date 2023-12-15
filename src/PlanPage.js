import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import Navbar from './NavBar';

import AuthRedirect from './authRedirect';
import WorkoutCalendar from './WorkoutCalendar';
import NavBarWrapper from './NavBar';
import DietChart from './DietChart';

class PlanPage extends Component {
  dietRef = React.createRef();
  state = {
    selectedDate: new Date().toLocaleString('en-us', { month: 'long', day: 'numeric' }),
    dateForapi: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
  }
  select(e) {
    this.setState({
      selectedDate: e.toLocaleString('en-us', { month: 'long', day: 'numeric' }),
      dateForapi: e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate()
    })

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.dateForapi != this.state.dateForapi) {
      this.dietRef.current.getUserDietOnDate(this.state.dateForapi);
    }
  }
  render() {
    return (
      <div className='page'>
        <div style={{position: 'relative', left: 150}}>
          <div style={{ position: 'absolute', left: 500, top: 300 }} className='load-anim'>
            <WorkoutCalendar onChange={(e) => this.select(e)} />

          </div>
          <h1 className='load-anim' style={{ position: 'relative', color: 'white', top: 300, left: 880 }}>{this.state.selectedDate}</h1>
          <div style={{ position: 'absolute', top: 0, left: 300, zIndex: -1, transform: 'scale(0.5)' }}>
            <DietChart hideInfo date={this.dateForapi} ref={this.dietRef} />
          </div>
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(PlanPage);
