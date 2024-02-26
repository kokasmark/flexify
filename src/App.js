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
import { CallApi } from './api';
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
    
  }

  async getMusclesTrained() {
    var r = await CallApi("user/muscles", {token: localStorage.getItem("loginToken"), timespan: 30})
    if (r.success) {
      console.log(r.muscles)
      this.setState({ muscles: r.muscles });
    }
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
            <MusclesView ref={this.muscleViewRef} muscles={this.state.muscles} showTips/>
          </div>
        </div>


        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(App);
