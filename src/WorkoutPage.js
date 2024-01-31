import './App.css';
import { Component} from 'react';
import Sidebar from './Sidebar';

import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';

import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';
import { host } from './constants'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const WorkoutPageWrapper = () => {
  const navigate = useNavigate();

  return <WorkoutPage navigate={navigate} />;
};

class WorkoutPage extends Component {
  state = {
      workout: localStorage.getItem("started-workout") ? JSON.parse(localStorage.getItem("started-workout")):null,
      currentExercise: 0,
      currentSet: 0
  }
  back(){
    const { navigate } = this.props;
          navigate('/');
  }
  next(){
    if(this.state.currentSet+1 < JSON.parse(this.state.workout.data[this.state.currentExercise].set_data).length){
      this.setState({currentSet: this.state.currentSet+1})
    }
    else{
      if(this.state.currentExercise +1 < this.state.workout.data.length){
      this.setState({currentSet: 0, currentExercise: this.state.currentExercise+1})
      }else{
        swal("Nice!", `You finished ${this.state.workout.name}!`, "success")
        this.back()
      }
    }
  }
  nameToGifUrl(name){
    return name.toLowerCase().replace(" ","_")
  }
  render() {
    if(this.state.workout == null){
      swal("Oops!", "There is an error with starting the workout!", "error")
          return(
            <div>
              <div onLoad={this.back()}></div>
              <NavBarWrapper/>
              <Sidebar />
            </div>
          )
    }else{
    return (
      <div className='page'>
        <div className='workout-container'>
          <h1>00:00:00</h1>
          <h2>{this.state.workout.name}</h2>
          <h3>{this.state.workout.data[this.state.currentExercise].comment}</h3>
          <h4>{this.state.currentSet+1}. Set</h4>
          <div className='workout-settings'>
            <p><Icon_weight/> {JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].weight}kg</p>
            <p><Icon_reps/> {JSON.parse(this.state.workout.data[this.state.currentExercise].set_data)[this.state.currentSet].reps}</p>
          </div>
          <div className='workout-gif'>
            <img src={require("./assets/exercises/"+this.nameToGifUrl(this.state.workout.data[this.state.currentExercise].comment)+".gif")}/>
          </div>
          <button onClick={()=> this.next()}>Next</button>
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
    }
    
  }
}
export default AuthRedirect(WorkoutPageWrapper);
