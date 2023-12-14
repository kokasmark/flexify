import logo from './logo.svg';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import React, { Component } from 'react';
import Calendar from 'react-calendar';
import { ReactComponent as Icon_duration } from './assets/icon-duration.svg';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';
import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';



import { Link } from 'react-router-dom';

export default class WorkoutCalendar extends Component {
  state = {
    selectedDate: new Date().toLocaleString('en-us', { month: 'long', day: 'numeric' }),
    selectedDateNumeric: this.formatDate(new Date()),
    dateForApi: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
    workouts: [],
    workoutsData: [],
    panelExtended: false,
    animationState: '',
    workoutsParsed: ""
  }
  getWorkouts() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), date: this.state.dateForApi });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://localhost:3001/api/workouts/date", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ workouts: r.dates });
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  getWorkoutsData() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), date: this.state.selectedDateNumeric });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("http://localhost:3001/api/workouts/data", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          console.log(r.data)
          this.setState({ workoutsData: r.data });
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  change(e) {
    if (this.props.onChange != null) {
      this.props.onChange(e);
    }
    this.setState({ panelExtended: this.state.selectedDateNumeric == this.formatDate(e) ? !this.state.panelExtended : true })
    this.setState({ selectedDate: e.toLocaleString('en-us', { month: 'long', day: 'numeric' }) })
    this.setState({ selectedDateNumeric: this.formatDate(e) })
    this.setState({ dateForApi: e.getFullYear() + '-' + (e.getMonth() + 1) })
    this.setState({ animationState: '' })

  }
  componentDidUpdate(oldProps, oldState) {
    if (oldState.selectedDate != this.state.selectedDate) {
      this.getWorkouts()
      this.getWorkoutsData()
      this.parseWorkouts()
    }
    if (oldState.workoutsData != this.state.workoutsData) {
      this.parseWorkouts()
    }
  }
  formatDate(d) {
    var year = d.getFullYear();
    var month = (d.getMonth() + 1).toString().padStart(2, '0');
    var day = d.getDate().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }
  getWorkoutToDate() {

    if (this.state.workouts.includes(this.state.selectedDateNumeric)) {
      return true;
    }
    else {
      return false;
    }
  }
  markWorkout(d, x) {
    var year = d.getFullYear();
    var month = (d.getMonth() + 1).toString().padStart(2, '0');
    var day = d.getDate().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate === x;
  }
  componentDidMount() {
    this.getWorkouts();
    this.getWorkoutsData();
  }
  hide = async (ms) => {

    this.setState({ animationState: '-close' })

    await new Promise(r => setTimeout(r, ms))

    this.setState({ panelExtended: false })

  }
  parseWorkouts(){
    var prevId=-1
    var parsed = []
    this.state.workoutsData.map((workout, index) => (
      
      parsed.push(<div key={index} style={{backgroundColor: 'var(--darker-contrast)', borderRadius: 5, padding: 10, margin: 5,animation: 'grow 0.4s ease-in'}}>
        
        {prevId != workout["id"]&&<div ><h2>{workout["workout_name"]}</h2>
        <p><Icon_duration/> <b>{workout["duration"]}</b></p>
        </div>}
        
        <p><b>{workout["name"]}</b></p>
        <ul>
        {JSON.parse(workout["set_data"])["sets"].map((set, index) => (
          <div style={{margin: 10}}>
          <li>
          <p><Icon_reps style={{width:20,height:20}}/> <b>{set["reps"]}</b></p>
          </li>
          <li>
          <p><Icon_weight style={{width:20,height:20}}/> <b>{set["weight"]}</b> kg</p>
          </li>
          </div>
        ))}
          
          
        </ul>
        
      </div>),prevId = workout["id"]
      
    ))
    this.setState({workoutsParsed: parsed})
  }
  render() {
    return (
      <div>
        <Calendar onChange={(e) => this.change(e)} tileClassName={({ date, view }) => {
          if (this.state.workouts.find(x => this.markWorkout(date, x))) {
            return 'highlight-date'
          }
        }} />
        {this.state.panelExtended && <div className={`anim interactable calendar-detail${this.state.animationState}`} style={{
          width: 350, height: 500, borderRadius: 10, backgroundColor: 'var(--contrast)', position: 'relative',
          left: 0
          , top: -280, zIndex: 1, borderWidth: 1, border: 'white', borderStyle: 'solid'
        }} onClick={() => this.hide(190)}>

          <h2>{this.state.selectedDate}</h2>
          {this.getWorkoutToDate() == true ? 
            <div>
              {this.state.workoutsParsed}
             
            </div> :
            <div>
              <p>There are no workouts for this date</p>
              <Link to='/plan' className='interactable' style={{color: 'white', textDecoration: 'none', backgroundColor: 'var(--heat-orange)', borderRadius: 5, padding: 10}}>Add workouts</Link>
            </div>}
        </div>}
      </div>
    );
  }
}
