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

const WorkoutPageWrapper = () => {
  const navigate = useNavigate();

  return <WorkoutPage navigate={navigate} />;
};

class WorkoutPage extends Component {
  state = {
    workout: localStorage.getItem("started-workout") ? JSON.parse(localStorage.getItem("started-workout")) : null,
    currentExercise: 0,
    currentSet: 0,
    seconds: 0,
    breakSeconds: 0,
    durationSeconds: 0,
    paused: false,
    muscles: []
  }
  getMusclesTrained(exercise) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ id: this.state.workout.data[exercise].exercise_template_id });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/exercise/muscles`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ muscles: JSON.parse(r.muscles) });
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  back() {
    const { navigate } = this.props;
    navigate('/');
  }
  next() {
    if (this.state.currentSet + 1 < JSON.parse(this.state.workout.data[this.state.currentExercise].set_data).length) {
      this.setState({ currentSet: this.state.currentSet + 1,durationSeconds: this.state.seconds })
    }
    else {
      if (this.state.currentExercise + 1 < this.state.workout.data.length) {
        this.setState({ currentSet: 0, currentExercise: this.state.currentExercise + 1})
        this.getMusclesTrained(this.state.currentExercise + 1)
      } else {
        swal("Nice!", `You finished ${this.state.workout.name} in ${new Date(this.state.seconds * 1000).toISOString().slice(11, 19)}!`, "success")
        this.back()
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
  componentDidMount() {
    this.timer()
    this.getMusclesTrained(0)
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
  }
  async break() {
    await new Promise(r => setTimeout(r, 1000))
    if (this.state.paused) {
      if (this.state.breakSeconds + 1 > 30) { this.setState({ paused: false, breakSeconds: 0 }) }
      else {
        console.log("!")
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
                    {JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].reps == 0 && <h3 className={'workout-timer duration-timer'}>{new Date((this.state.seconds-(this.state.durationSeconds)) * 1000).toISOString().slice(11, 19)}</h3>}
                  </div> 
                }
              </div>
              <h2>{this.state.workout.name}</h2>
            </div>

            <div className={'workout-right-panel' + (this.state.paused ? ' workout-paused' : '')}>
              <h4 className='current-set'>{this.state.currentSet + 1} / {JSON.parse(this.state.workout.data[this.state.currentExercise].set_data).length} Set</h4>
              <h3>{this.state.workout.data[this.state.currentExercise].comment}</h3>
              <div className='workout-settings'>

                {JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].reps > 0 ?
                  <span>
                    <p><Icon_weight /> <b>{JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].weight}</b> kg</p>
                    <p><Icon_reps /> <b>{JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].reps}</b></p></span>
                  :
                  <p><Icon_time /> <b>{JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].time} s</b></p>}
              </div>
              <button className={'workout-control-btn ' + (this.state.paused ? '' : 'interactable')} disabled={this.state.paused} onClick={() => this.next()}>Next</button>
              <button className={'workout-control-btn ' + (this.state.paused ? '' : 'interactable')} disabled={this.state.paused} onClick={() => this.startBreak()}>Break(30s)</button>
              <button className={'workout-control-btn ' + (this.state.paused ? '' : 'interactable')} disabled={this.state.paused} onClick={() => this.next()}>Skip</button>
            </div>

            <div className={'workout-middle-panel' + (this.state.paused ? ' workout-paused' : '')}>
              <MusclesView autoRotate={this.state.paused ? false : true} array={this.state.muscles} />
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
