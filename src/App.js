import './App.css';
import React, { Component } from 'react';
import MusclesView from './MusclesView';
import Sidebar from './Sidebar';
import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';

import Carousel from 'react-bootstrap/Carousel';

import { host } from './constants'
import GetString from './language';
import { CallApi } from './api';
import DownloadPanel from './DownloadPanel';
class App extends Component {
  muscleViewRef = React.createRef();
  calendarRef = React.createRef()
  chartRef = React.createRef();
  state = {
    muscles: [],
    timespan: 30,
    selectedTimeSpan: 'Monthly'
  }

  isDesktop() {
    if (window.innerWidth > 1224) {
      return true;
    }
    else {
      return false;
    }
  }
  async getMusclesTrained(day) {
    var r = await CallApi("user/muscles", {token: localStorage.getItem("loginToken"), timespan: day})
    if (r.success) {
      this.setState({ muscles: r.muscles });
    }
  }
  componentDidMount() {
    this.getMusclesTrained(30);
    //this.connect(document.getElementById("32"), document.getElementById("45"),"#fff",3)
  }
  selectTimeSpan(name, day){
    this.setState({timespan: day, selectedTimeSpan: name})
    this.getMusclesTrained(day);
  }
  render() {
    return (
      <div className='page'>
        <div className='container'>
            <div className='timePeriod load-anim'>
              <p className='interactable' style={{fontWeight: this.state.selectedTimeSpan == "Weekly" ? 'bold' : 'normal'}} 
              onClick={()=>this.selectTimeSpan("Weekly",7)}>{GetString("home-period")[0]}</p>
              <p className='interactable' style={{fontWeight: this.state.selectedTimeSpan == "Monthly" ? 'bold' : 'normal'}} 
              onClick={()=>this.selectTimeSpan("Monthly",30)}>{GetString("home-period")[1]}</p>
              <p className='interactable' style={{fontWeight: this.state.selectedTimeSpan == "6 Months" ? 'bold' : 'normal'}} 
              onClick={()=>this.selectTimeSpan("6 Months",182)}>{GetString("home-period")[2]}</p>
              <p className='interactable' style={{fontWeight: this.state.selectedTimeSpan == "Yearly" ? 'bold' : 'normal'}} 
              onClick={()=>this.selectTimeSpan("Yearly",365)}>{GetString("home-period")[3]}</p>
              <p className='interactable' style={{fontWeight: this.state.selectedTimeSpan == "All" ? 'bold' : 'normal'}} 
              onClick={()=>this.selectTimeSpan("All",69420)}>{GetString("home-period")[4]}</p>
            </div>

            

          <div className='muscle-container-home' style={{ position: 'relative', top: -10 }}>
            <MusclesView ref={this.muscleViewRef} muscles={this.state.muscles} showTips={true}/>
          </div>
        </div>


        <DownloadPanel />
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(App);
