import logo from './logo.svg';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import React, { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';


import 'react-calendar/dist/Calendar.css';
import Navbar from './NavBar';

import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';
import { Calendar, momentLocalizer } from 'react-big-calendar' 
import moment from 'moment'





class PlanPage extends Component {
  localizer = momentLocalizer(moment)
  state = {
    selectedDate: new Date().toLocaleString('en-us', { month: 'long', day: 'numeric' }),
    dateForapi: null,
    dates: [],
    idsInEvents:[],
    events: []
  }
  getWorkouts(date) {
    var myHeaders = new Headers();
    var d = date.split("-")
    date = d[0]+(d[1].length <2 ? "-0":"-")+d[1]
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), date: date, location: "web" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://localhost:3001/api/workouts/date", requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ dates: r.dates});
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  getWorkoutsData(date) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), date: date , location: "web"});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://localhost:3001/api/workouts/data", requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          console.log(r.data)
          this.addEvent(r.data,date);
        } else {
            console.log(r)
        }
      })
      .catch(error => console.log('error', error));
  }
  addEvent(data,date){
    this.setState((prevState) => {
      var updatedEvents = [ ...prevState.events ];
      var ids = [...prevState.idsInEvents]
      var d = date.split("-")
      var day = new Date(data[0].date)
      const [hours, minutes, seconds] = data[0].duration.split(':').map(Number);

      const newDate = new Date(day.getTime() + hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000);
      if(!this.state.idsInEvents.includes(data[0].id)){
        updatedEvents.push({"title": data[0].workout_name, 'start': day,
        'end': newDate})
        ids.push(data[0].id)
      }
      return { events: updatedEvents, idsInEvents: ids };
    });
  }
  componentDidMount(){
    this.getWorkouts( new Date().getFullYear() + '-' + (new Date().getMonth() + 1))
    
  }
  formatDate(date){
    var d = date.toString().split("-")
    var res = date
    if(d[1].length < 2){
      res = d[0] + "-"+"0"+d[1]
    }
    return res
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.dates != this.state.dates){
      this.state.dates.forEach(date => {
        this.getWorkoutsData(date)
      });
    }
    if(prevState.selectedDay != this.state.selectedDay){
      console.log(this.state.selectedDay)
    }
  }
  navigate(e){
    this.getWorkouts(e.getFullYear() + '-' + (e.getMonth() + 1))
  }
  render() {
    return (
      <div className='page'>
          <Calendar
                localizer={this.localizer}
                startAccessor="start"
                endAccessor="end"
                className='calendar'
                events={this.state.events}
                onNavigate={(e) => { this.navigate(e) }}
              />
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(PlanPage);
