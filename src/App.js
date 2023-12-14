import './App.css';
import React, { Component } from 'react';
import MusclesView from './MusclesView';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import Calendar from 'react-calendar';
import { PieChart } from 'react-minimal-pie-chart';
import AuthRedirect from './authRedirect';
import DietChart from './DietChart';
import WorkoutCalendar from './WorkoutCalendar';
import NavBarWrapper from './NavBar';

class App extends Component {
  muscleViewRef = React.createRef();

  state = {
    muscles: []
  }

  colorMuscles(muscles) {
    const muscleCounts = {};
    var count = 0;
    // Assuming 'muscles' is an array of muscle objects
    for (var i = 0; i < muscles.length; i++) {
      var muscleData = JSON.parse(muscles[i]);
      for(var ii = 0; ii < muscleData.length; ii++){
      var name = muscleData[ii]; // Assuming the muscle is the first element in the array
          count++;
      // Count the occurrences of each muscle
      muscleCounts[name] = (muscleCounts[name] || 0) + 1;
      }
      
    }
  
    // Calculate the average count for each muscle group
    const averageCounts = {};
  
    for (const muscleName in muscleCounts) {
      const totalOccurrences = muscleCounts[muscleName];
      const averageCount = totalOccurrences / count; // Adjust the denominator if needed
      averageCounts[muscleName] = averageCount;
    }
  
    // Map the average counts to the range [0, 3] and update muscle groups
    for (const muscleName in averageCounts) {
      const mappedValue = Math.min(3, Math.max(1, Math.round(averageCounts[muscleName] * 3)));
      this.muscleViewRef.current.updateMuscleGroup(muscleName, mappedValue);
      console.log(muscleName, mappedValue)
    }
  }

  getMusclesTrained(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: localStorage.getItem('loginToken')});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/home/muscles", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if(r.success){
          this.setState({muscles: r.muscles});
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
componentDidMount(){
  this.getMusclesTrained();
}
  render() {
    this.colorMuscles(this.state.muscles);
    return (
      <div className='page'>
        <div style={{position: 'relative'}} >
        <div className='timePeriod load-anim'>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 25px", fontWeight: 'bold'}}>Weekly</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>Monthly</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>6 Months</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>1 Year</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 25px 4px 4px"}}>All</p>
        </div>
        
        
        <div style={{position: 'absolute', right: 550, top: 50, zIndex:-1}} className='home-chart'>
            <DietChart hideInfo/>
          </div> 
        </div>
        <MusclesView ref={this.muscleViewRef} muscles={this.state.muscles}/>
        <div className='load-anim' style={{position: 'absolute', left: 200, top: 400}}>
          <WorkoutCalendar />
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(App);
