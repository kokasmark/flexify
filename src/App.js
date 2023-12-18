import './App.css';
import React, { Component } from 'react';
import MusclesView from './MusclesView';
import Sidebar from './Sidebar';
import AuthRedirect from './authRedirect';
import DietChart from './DietChart';
import WorkoutCalendar from './WorkoutCalendar';
import NavBarWrapper from './NavBar';

import Carousel from 'react-bootstrap/Carousel';

import { host } from './constants'
import GetString from './language';
class App extends Component {
  muscleViewRef = React.createRef();
  calendarRef = React.createRef()
  chartRef = React.createRef();
  state = {
    muscles: []
  }

  isDesktop() {
    if (window.innerWidth > 1224) {
      return true;
    }
    else {
      return false;
    }
  }
  colorMuscles(muscles) {
    const muscleCounts = {};
    var count = 0;
    // Assuming 'muscles' is an array of muscle objects
    for (var i = 0; i < muscles.length; i++) {
      var muscleData = JSON.parse(muscles[i]);
      for (var ii = 0; ii < muscleData.length; ii++) {
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
    }
  }

  getMusclesTrained() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), location: "web" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/home/muscles`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ muscles: r.muscles });
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount() {
    this.getMusclesTrained();
  }
  render() {
    this.colorMuscles(this.state.muscles);
    return (
      <div className='page'>
        <div>
          <div>
            <div className='timePeriod load-anim'>
              <p className='interactable'>{GetString("home-period")[0]}</p>
              <p className='interactable'>{GetString("home-period")[1]}</p>
              <p className='interactable'>{GetString("home-period")[2]}</p>
              <p className='interactable'>{GetString("home-period")[3]}</p>
              <p className='interactable'>{GetString("home-period")[4]}</p>
            </div>


            <div style={{ position: 'relative', float: 'right', right: -250, top: 300, zIndex: -1 }} className='home-chart'>
              <DietChart noDataStyle={{ position: 'relative', top: 200, right: 400 }} hideInfo />
            </div>
          </div>
          <div style={{ position: 'relative', bottom: 50 }}>
            <MusclesView ref={this.muscleViewRef} muscles={this.state.muscles} />
          </div>
          <div className='load-anim' style={{ position: 'absolute', left: 200, top: 400 }}>
            <WorkoutCalendar ref={this.calendarRef} parent={this} />
          </div>
        </div>


        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(App);
