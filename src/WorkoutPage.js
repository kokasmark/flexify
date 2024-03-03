import './App.css';
import React, { Component } from 'react';
import Sidebar from './Sidebar';

import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';
import { ReactComponent as Icon_time } from './assets/icon-duration.svg';

import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';
import { host } from './constants'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import MusclesView from './MusclesView';
import GetString from './language';
import { CallApi } from './api';

const WorkoutPageWrapper = () => {
  const navigate = useNavigate();

  return <WorkoutPage navigate={navigate} />;
};

class WorkoutPage extends Component {
  state = {
    workout: this.parseJson(localStorage.getItem("started-workout")) ? this.parseJson(localStorage.getItem("started-workout")) : null,
    currentExercise: 0,
    currentSet: 0,
    seconds: 0,
    breakSeconds: 0,
    durationSeconds: 0,
    paused: false,
    muscles: [],
    templates: [],
    start: new Date()
  }
  async getExerciseTemplates() {
    var r = await CallApi("exercises", { token: localStorage.getItem("loginToken"), location: 'web' })
    this.setState({ templates: Object.values(r.json) });
  }
  getMusclesTrained(e) {
    var id = this.parseJson(this.state.workout.json)[e].name
    this.state.templates.forEach(exercise => {
      if(exercise.name == id){
        this.setState({muscles: exercise.muscles})
      }
    });
    
  }
  back() {
    const { navigate } = this.props;
    navigate('/');
  }
  async saveWorkout(data, time){
    var date = new Date(time.start)
    var r = await CallApi("workouts/save", 
    {token: localStorage.getItem('loginToken'), name: data.name, time: JSON.stringify(time), json: JSON.stringify(data.json), 
    date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`})
    if (r.success) {
      return r.id;
    } else {
      return null
    }
  }
  async next() {
    if (this.state.currentSet + 1 < this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data.length) {
      this.setState({ currentSet: this.state.currentSet + 1,durationSeconds: this.state.seconds })
    }
    else {
      console.log(this.state.currentExercise + 1 , this.state.workout.json.length)
      if (this.state.currentExercise + 1 < this.parseJson(this.state.workout.json).length) {
        this.setState({ currentSet: 0, currentExercise: this.state.currentExercise + 1})
        this.getMusclesTrained(this.state.currentExercise + 1)
      } else {
        var id;
        console.log(typeof localStorage.getItem("workout-isCalendar"))
        if(localStorage.getItem("workout-isCalendar")==="true"){
          id = this.state.workout.id
        }else{
          var endDate = new Date(this.state.start.getTime() + this.state.seconds * 1000);

          // Convert dates to string format
          var startDateString = this.state.start.toString();
          var endDateString = endDate.toString();

          id = await this.saveWorkout(this.state.workout, {start: startDateString, end: endDateString});
        }
          var r = await CallApi("workouts/finish", {token: localStorage.getItem('loginToken'), id: id})
          if (r.success) {
              swal("Nice!", `You finished ${this.state.workout.name} in ${new Date(this.state.seconds * 1000).toISOString().slice(11, 19)}!`, "success")
              this.back()
          }
      }
    }
  }
  nameToGifUrl(name) {
    return name.toLowerCase().replace(" ", "_")
  }
  async timer() {
    await new Promise(r => setTimeout(r, 1000))
    if (!this.state.paused) {
      this.setState({ seconds: this.state.seconds + 1 })
    }
    this.timer()
  }
  parseJson(input){
    try{
      return JSON.parse(input)
    }
    catch{
      return input
    }
  }
  componentDidMount() {
    console.log(this.parseJson(this.state.workout.json))
    this.timer()
    this.getExerciseTemplates()
  }
  startBreak() {
    this.setState({ paused: true })
  }
  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.paused, prevState.paused)
    if (this.state.paused != prevState.paused) {
      this.break()
    }
    if (this.state.workout != prevState.workout) {
      this.getMusclesTrained()
    }
    if(this.state.templates != prevState.templates){
      this.getMusclesTrained(0)
    }
  }
  async break() {
    await new Promise(r => setTimeout(r, 1000))
    if (this.state.paused) {
      if (this.state.breakSeconds + 1 > 30) { this.setState({ paused: false, breakSeconds: 0 }) }
      else {
        this.setState({ breakSeconds: this.state.breakSeconds + 1 })
        this.break()
      }
    }
  }
  render() {
    if (this.state.workout == null) {
      swal("Oops!", "There is an error with starting the workout!", "error")
      return (
        <div>
          <div onLoad={this.back()}></div>
          <NavBarWrapper />
          <Sidebar />
        </div>
      )
    } else {
      return (
        <div className='page'>
          <div className='workout-container'>
            <div className='workout-left-panel'>
              <div className='timers'>
                <h1 className={'workout-timer'}>{this.state.paused == false ? new Date((this.state.seconds) * 1000).toISOString().slice(11, 19) : new Date(this.state.breakSeconds * 1000).toISOString().slice(14, 19)}</h1>
                {this.state.paused == false &&
                  <div>
                    {this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data[this.state.currentSet].reps == 0 && <h3 className={'workout-timer duration-timer'}>{new Date((this.state.seconds-(this.state.durationSeconds)) * 1000).toISOString().slice(11, 19)}</h3>}
                  </div> 
                }
              </div>
              <h2>{this.state.workout.name}</h2>
            </div>

            <div className={'workout-right-panel' + (this.state.paused ? ' workout-paused' : '')}>
              <h4 className='current-set'>{this.state.currentSet + 1} / {this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data.length} Set</h4>
              <h3>{this.parseJson(this.state.workout.json)[this.state.currentExercise].comment}</h3>
              <div className='workout-settings'>

                {this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data[this.state.currentSet].reps > 0 ?
                  <span>
                    <p><Icon_weight /> <b>{this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data[this.state.currentSet].weight}</b> kg</p>
                    <p><Icon_reps /> <b>{this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data[this.state.currentSet].reps}</b></p></span>
                  :
                  <p><Icon_time /> <b>{this.parseJson(this.state.workout.json)[this.state.currentExercise].set_data[this.state.currentSet].time} s</b></p>}
              </div>
              <button className={'workout-control-btn ' + (this.state.paused ? '' : 'interactable')} disabled={this.state.paused} onClick={() => this.next()}>Next</button>
              <button className={'workout-control-btn ' + (this.state.paused ? '' : 'interactable')} disabled={this.state.paused} onClick={() => this.startBreak()}>Break(30s)</button>
              <button className={'workout-control-btn ' + (this.state.paused ? '' : 'interactable')} disabled={this.state.paused} onClick={() => this.next()}>Skip</button>
            </div>

            <div className={'workout-middle-panel' + (this.state.paused ? ' workout-paused' : '')}>
              <MusclesView autoRotate={this.state.paused ? false : true} array={this.state.muscles}/>
            </div>

          </div>
          <NavBarWrapper />
          <Sidebar />
        </div>
      );
    }

  }
}
export default AuthRedirect(WorkoutPageWrapper);
