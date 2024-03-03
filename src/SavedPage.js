import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

import Sidebar from './Sidebar';

import 'react-calendar/dist/Calendar.css';

import AuthRedirect from './authRedirect';
import { Card, CardBody } from 'react-bootstrap';
import NavBarWrapper from './NavBar';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';
import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';
import { ReactComponent as Icon_duration } from './assets/icon-duration.svg';
import { ReactComponent as Icon_copy } from './assets/icon-copy.svg';
import { Link } from 'react-router-dom';

import { host } from './constants'

import { FaPersonRunning } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { FaPerson } from "react-icons/fa6";

import { FaPlay } from "react-icons/fa";
import { FaListUl } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import { GiWeight } from "react-icons/gi";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { PiClockCountdown } from "react-icons/pi";
import { CallApi } from './api';

class SavedPage extends Component {
  state = {
    savedTemplates: [],
    icons: [<FaPersonRunning className='saved-card-icon'/>, <FaPerson className='saved-card-icon'/>, <CgGym className='saved-card-icon'/>],
    selectedCard: -1,
    details: false
  }
  async getSavedTemplates() {
    var r = await CallApi("templates", {token: localStorage.getItem('loginToken')})

    if (r.success) {
      this.setState({ savedTemplates: r.templates })
    } else {

    }
  }
  
  componentDidMount() {
    this.getSavedTemplates();
    const slider = document.querySelector('.saved-workouts');

    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk/2;
    });
  }
  select(index){
    if(this.state.selectedCard != index){
      this.setState({selectedCard: index})
    }
  }
  startWorkout(template){
    localStorage.setItem("started-workout", JSON.stringify(template)); 
    localStorage.setItem("workout-isCalendar", false)
    window.location.href = `${window.location.origin}/workout`
  }
  render() {
    return (
      <div className='page'>
        <h1 className='title'>Workouts</h1>
        <h3 className='sub-title'>Start workouts from here without them being planned.</h3>
        <div className={`saved-workouts${this.state.details == true ? " details":""}`}>
          {this.state.savedTemplates.map((template,index) => (
            <div className={`workout-card${this.state.selectedCard == index ? " selected-card":""}${this.state.details == true ? " card-detail":""}`} 
            style={{animation: `card-load-${index % 2 == 0 ? 'up': 'down'} ${index/2}s`}}>
            <Card key={index} onClick={()=>this.select(index)}>
                <div className='saved-card-icon'></div>
                <div className='bottom'>
                  <h1>{template.name}</h1>
                  {this.state.selectedCard != index && <div className='summary'>
                    {<ul className='exercises'>
                    {template.json.map((data,index) => (
                      <li className='exercise'>
                        <p><b>{data.set_data.length}</b>x {data.name}</p>
                      </li>
                    ))}
                  </ul>}
                  </div>}
                </div>
                {this.state.details == false && <div>
                <FaPlay onClick={()=> this.startWorkout(template)} className='control-btn interactable'/>
                  <MdDelete className='control-btn interactable'/>
                  </div>}
                  
            </Card>
            </div>
          )
          )}
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(SavedPage);
