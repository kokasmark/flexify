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
    var tipIndex = 0;
    for (const muscleName in averageCounts) {
      const mappedValue = Math.min(3, Math.max(1, Math.round(averageCounts[muscleName] * 3)));
      this.muscleViewRef.current.updateMuscleGroup(muscleName, mappedValue);

      /*console.log(muscleName,this.muscleViewRef.current.findMuscleIndex(muscleName))
      document.body.innerHTML += `<p style='position: absolute; top: ${300+50*tipIndex}px; ${tipIndex%2==0 ? 'right: 400px;' : 'left: 400px;'} color: white;' id='tip-${tipIndex}'>${muscleName}</p>`
      this.connect(document.getElementById(this.muscleViewRef.current.findMuscleIndex(muscleName)), document.getElementById(`tip-${tipIndex}`),"#fff",3)
      
      tipIndex++;
      
      First try for tips on the homepage
      */
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
    //this.connect(document.getElementById("32"), document.getElementById("45"),"#fff",3)
  }
  getOffset( el ) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left-10,
        top: rect.top-10,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}
connect(div1, div2, color, thickness) { // draw a line connecting elements
  var off1 = this.getOffset(div1);
  var off2 = this.getOffset(div2);
  // bottom right
  var x1 = off1.left + off1.width;
  var y1 = off1.top + off1.height;
  // top right
  var x2 = off2.left + off2.width;
  var y2 = off2.top;
  // distance
  var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
  // center
  var cx = ((x1 + x2) / 2) - (length / 2);
  var cy = ((y1 + y2) / 2) - (thickness / 2);
  // angle
  var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
  // make hr
  var htmlLine = "<div style='z-index: 1;padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
  //
  // alert(htmlLine);
  document.body.innerHTML += htmlLine;
}
  render() {
    this.colorMuscles(this.state.muscles);
    return (
      <div className='page'>
        <div className='container'>
            <div className='timePeriod load-anim'>
              <p className='interactable'>{GetString("home-period")[0]}</p>
              <p className='interactable'>{GetString("home-period")[1]}</p>
              <p className='interactable'>{GetString("home-period")[2]}</p>
              <p className='interactable'>{GetString("home-period")[3]}</p>
              <p className='interactable'>{GetString("home-period")[4]}</p>
            </div>


            

          <div className='muscle-container-home' style={{ position: 'relative', top: -10 }}>
            <MusclesView ref={this.muscleViewRef} muscles={this.state.muscles} />
          </div>

        </div>


        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(App);
