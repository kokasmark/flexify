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
import 'moment/locale/en-gb';
import { Card } from 'react-bootstrap';
import { host } from './constants';
import swal from 'sweetalert';
import { IoIosCloseCircleOutline } from "react-icons/io"
import {CallApi} from "./api";
moment.locale('en-GB');

class PlanPage extends Component {

  localizer = momentLocalizer(moment)
  state = {
    selectedDate: new Date().toLocaleString('en-us', { month: 'long', day: 'numeric' }),
    dateForapi: null,
    dates: [],
    loaded: {},
    idsInEvents: [],
    events: [],
    newEvent: null,
    addWorkoutPopUp: false,
    savedTemplates: []
  }
  async getSavedTemplates() {
    var r = await CallApi("templates", {token: localStorage.getItem('loginToken')})
    console.log(r)
    if (r.success) {
      this.setState({ savedTemplates: r.templates })
    } else {

    }
  }
  async getWorkouts(date) {
    var r = await CallApi("workouts/dates", {token: localStorage.getItem('loginToken'), date: date})
    if (r.success) {
      var updatedLoaded = {}
      r.dates.forEach(date => {
        updatedLoaded[date] = {}
      });
      console.log(r.dates)
      this.setState({ loaded: updatedLoaded, events: [] });
    } else {

    }
  }  
  async getWorkoutsData(date) {
    var r = await CallApi("workouts/data", {token: localStorage.getItem('loginToken'), date: date})
    if (r.success) {
      var updatedLoaded = this.state.loaded
      updatedLoaded[date] = r.data
      console.log(date,r.data)
      this.parseEvent(r.data)
      this.setState({ loaded: updatedLoaded });
    } else {

    }
  }
  parseEvent(data) {
    data.forEach(d => {
      if (d === null) return;
      
    this.setState((prevState) => {
        var updatedEvents = [...prevState.events];
        var start = new Date(JSON.parse(d.time).start);
        var end;
        if (d.duration !== "00:00:00") {
            var durationParts = d.duration.split(":");
            var durationMilliseconds = (+durationParts[0] * 60 * 60 * 1000) +
                                        (+durationParts[1] * 60 * 1000) +
                                        (+durationParts[2] * 1000);
            end = new Date(start.getTime() + durationMilliseconds);
        } else {
            end = new Date(JSON.parse(d.time).end);
        }
        console.log(end);
        updatedEvents.push({
            "title": d.name,
            "start": start,
            "end": end
        });
        return { events: updatedEvents };
    });
  });
}

  addEvent(data, date) {
    this.setState((prevState) => {
      var updatedEvents = [...prevState.events];
      var ids = [...prevState.idsInEvents]
      var d = date.split("-")
      var day = new Date(data[0].date)
      const [hours, minutes, seconds] = data[0].duration.split(':').map(Number);

      const newDate = new Date(day.getTime() + hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000);
      if (!this.state.idsInEvents.includes(data[0].id)) {
        updatedEvents.push({
          "title": data[0].workout_name, 'start': day,
          'end': newDate
        })
        ids.push(data[0].id)
      }

      return { events: updatedEvents, idsInEvents: ids };
    });
  }
  async saveWorkout(data, time){
    console.log(time)
    var r = await CallApi("workouts/save", {token: localStorage.getItem('loginToken'), name: data.name, time: JSON.stringify(time), json: JSON.stringify(data.json), duration: "00:00:00"})
    if (r.success) {
      swal("Success!", `${data.name} was saved!`, "success")
    } else {

    }
  }
  componentDidMount() {
    this.getWorkouts(new Date().getFullYear() + '-' + (new Date().getMonth() + 1));
    this.getSavedTemplates();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.loaded != this.state.loaded) {
      Object.keys(this.state.loaded).map((date) => {
        console.log(date)
        this.getWorkoutsData(date)
      });
    }
    if (prevState.selectedDay != this.state.selectedDay) {
      console.log(this.state.selectedDay)
    }
  }
  navigate(e) {
    this.getWorkouts(e.getFullYear() + '-' + (e.getMonth() + 1))
  }
  selectTime(e) {
    console.log(e)
    this.setState({ addWorkoutPopUp: true, newEvent: e })
  }
  addWorkout(template) {
    this.setState((prevState) => {
      var updatedEvents = [...prevState.events];
      updatedEvents.push({
        "title": template.name, 'start': this.state.newEvent.start,
        'end': this.state.newEvent.end, "data": JSON.stringify(template)
      })
      this.saveWorkout(template, {start:  new Date(this.state.newEvent.start).toString(), end: new Date(this.state.newEvent.end).toString()})
      return { events: updatedEvents, addWorkoutPopUp: false, newEvent: null };
    });
  }
  handleEventClick(e) {
    swal({
      title: `Wanna start ${e.title}?`,
      buttons: ["Cancel", "Start"],
      icon: 'warning'
    }).then((result) => {
      if (result) {
        localStorage.setItem("started-workout", e.data)
        console.log(window.location)
        window.location.href = `${window.location.origin}/workout`
      }
    });
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
          views={['month', 'week']}
          selectable
          onSelectSlot={(e) => this.selectTime(e)}
          style={{ filter: this.state.addWorkoutPopUp ? "blur(3px)" : "" }}
          onSelectEvent={(e) => this.handleEventClick(e)}
          onRangeChange={range => {
            console.log(range)
        }}
        />

        {this.state.addWorkoutPopUp && <div className='calendar-add-popup'>
          <div className='header'>
            <h2>{this.state.newEvent.start.toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - {this.state.newEvent.end.toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</h2>
            <IoIosCloseCircleOutline className='control-btn' onClick={() => this.setState({ addWorkoutPopUp: false, newEvent: null })} />
          </div>
          <div className='workouts'>
            {this.state.savedTemplates.map((template,index) => (
                          <Card onClick={()=> this.addWorkout(template)}>
                            <Card.Body>
                              <h5 style={{color: "white",fontSize:15, textAlign: "center"}}>{template.name}</h5>
                            </Card.Body>
                          </Card>
                        ))

                        }
            
          </div>
        </div>}
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(PlanPage);
