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

const eventStyleGetter = (event, start, end, isSelected) => {
  let classNames = 'rbc-event-content';

  if (event.isFinished) {
    classNames += ' finished-event'; // Add a class for finished events
  }

  return {
    className: classNames
  };
};

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
    savedTemplates: [],
    currentRange: null
  }
  async getSavedTemplates() {
    var r = await CallApi("templates", {token: localStorage.getItem('loginToken')})
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
      this.setState({ loaded: updatedLoaded, events: [] });
    } else {

    }
  }  
  async getWorkoutsData(date) {
    var r = await CallApi("workouts/data", {token: localStorage.getItem('loginToken'), date: date})
    if (r.success) {
      var updatedLoaded = this.state.loaded
      updatedLoaded[date] = r.data
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
        var end = new Date(JSON.parse(d.time).end);
        
            
        
        console.log(end);
        updatedEvents.push({
            "title": d.name,
            "start": start,
            "end": end,
            data: JSON.stringify(d),
            isFinished: d.isFinished == 1
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
    var r = await CallApi("workouts/save", {token: localStorage.getItem('loginToken'), name: data.name, time: JSON.stringify(time), json: JSON.stringify(data.json)})
    if (r.success) {
      swal("Success!", `${data.name} was saved!`, "success")
    } else {

    }
  }
  componentDidMount() {
    this.getWorkouts(new Date().getFullYear() + '-' + (new Date().getMonth() + 1));
    this.getSavedTemplates();
  }

  async daysAnimation(){
    //console.log("DAYS ANIMATION")
    var calendarMonthView = document.querySelector('.rbc-month-view')
    
    if(calendarMonthView != undefined){
      await new Promise(resolve => setTimeout(resolve, 100))
      var offset = 0;
      calendarMonthView.childNodes.forEach((row)  => {
        //console.log(row.childNodes.length)
        if(row.childNodes.length == 2){
        var bg = row.childNodes[0]
        var content = row.childNodes[1].childNodes[0]
        //console.log("!",bg, content)
        for(var i = 0; i < bg.childNodes.length; i++){
          //console.log(content)
          offset += 0.05;
          try{
            bg.childNodes[i].style.animation = `day-load 1s ${offset}s forwards`;
            content.childNodes[i].style.animation = `day-load 1s ${offset}s forwards`;
            
          }catch{
  
          }
          
        }
      }
      });
    }
  }
  async scrollToCurrentTime(){
    var timeView = document.querySelector('.rbc-time-content');
    if(timeView != undefined){
      await new Promise(resolve => setTimeout(resolve, 100))
    var events = document.querySelectorAll('.rbc-event');

    
    function scrollToEvent(event) {
        
        var eventTop = event.getBoundingClientRect().top;
        var timeViewTop = timeView.getBoundingClientRect().top;
        var relativeTop = eventTop - timeViewTop;
        var percentage = (relativeTop / timeView.offsetHeight) * 100;

        
        var scrollPosition = (percentage / 100) * timeView.scrollHeight;

        
        setTimeout(function () {
            timeView.scrollTo(0, scrollPosition);
        }, 500); 
    }

    
    events.forEach(function (event) {
        scrollToEvent(event);
    });

    
    setTimeout(function () {
        
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();

        
        var currentTimeInMinutes = hours * 60 + minutes;

        
        var percentage = (currentTimeInMinutes / (24 * 60)) * 100;

        
        var scrollPosition = (percentage / 100) * timeView.scrollHeight;

        
        setTimeout(function () {
            timeView.scrollTo(0, scrollPosition);
        }, 500); 
    }, events.length * 500);

    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.loaded != this.state.loaded) {
      this.daysAnimation()
      Object.keys(this.state.loaded).map((date) => {
        console.log(date)
        this.getWorkoutsData(date)
        
      });
    }
    if (prevState.selectedDay != this.state.selectedDay) {
      console.log(this.state.selectedDay)
    }
    if(prevState.currentRange != this.state.currentRange){
      this.daysAnimation()

      this.scrollToCurrentTime()
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
    console.log(e)
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
            this.setState({currentRange: range})
        }}
        eventPropGetter={eventStyleGetter}
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
