import logo from './logo.svg';
import './App.css';
import React,{ Component } from 'react';
import Calendar from 'react-calendar';
import { ReactComponent as Icon_expand } from './assets/icon-expand.svg';

import 'react-calendar/dist/Calendar.css';


export default class WorkoutCalendar extends Component {
  state = {
    selectedDate: new Date().toLocaleString('en-us',{month:'long', day: 'numeric'}),
    selectedDateNumeric: this.formatDate(new Date()),
    dateForApi: new Date().getFullYear() + '-' + (new Date().getMonth()+1),
    workouts: [],
    panelExtended: false,
    animationState: ''
  }
  getWorkouts(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: localStorage.getItem('loginToken'), date: this.state.dateForApi});

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
        if(r.success){
          this.setState({workouts: r.dates});
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
  change(e){
    if(this.props.onChange != null){
    this.props.onChange(e);
    }
    this.setState({panelExtended: this.state.selectedDateNumeric == this.formatDate(e) ? !this.state.panelExtended:true})
    this.setState({selectedDate: e.toLocaleString('en-us',{month:'long', day: 'numeric'})})
    this.setState({selectedDateNumeric: this.formatDate(e)})
    this.setState({dateForApi:e.getFullYear() + '-' +(e.getMonth()+1)})
    this.setState({animationState: ''})
   
  }
  componentDidUpdate(oldProps, oldState){
    if(oldState.selectedDate != this.state.selectedDate){
      this.getWorkouts()
    }
  }
  formatDate(d){
    var year = d.getFullYear();
    var month = (d.getMonth() + 1).toString().padStart(2, '0');
    var day = d.getDate().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }
  getWorkoutToDate(){
    
    if(this.state.workouts.includes(this.state.selectedDateNumeric)){
      return true;
    }
    else{
      return false;
    }
  }
  markWorkout(d,x){
    var year = d.getFullYear();
    var month = (d.getMonth() + 1).toString().padStart(2, '0');
    var day = d.getDate().toString().padStart(2, '0');

    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate === x;
  }
  componentDidMount(){
    this.getWorkouts();
  }
  hide = async (ms) => {

    this.setState({animationState: '-close'})

    await new Promise(r => setTimeout(r, ms))

    this.setState({panelExtended: false})

}
  render() {
    return (
      <div>
        <Calendar onChange={(e) => this.change(e)} tileClassName={({ date, view }) => {
      if(this.state.workouts.find(x=>this.markWorkout(date,x))){
        return  'highlight-date'
      }
    }}/>
        {this.state.panelExtended && <div  className={`anim interactable calendar-detail${this.state.animationState}`} style={{width: 350, height: 280, borderRadius: 10,backgroundColor: 'var(--contrast)', position: 'relative', 
        left: 0
        , top: -280, zIndex:1}} onClick={()=>this.hide(190)}>
          
          <h2>{this.state.selectedDate}</h2>
          {this.getWorkoutToDate() == true ? <div></div> : <div><p>There are no workouts for this date</p></div>}
        </div>}
      </div>
    );
  }
}
