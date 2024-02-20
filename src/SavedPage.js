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

class SavedPage extends Component {
  state = {
    savedTemplates: [],
    icons: [<FaPersonRunning className='saved-card-icon'/>, <FaPerson className='saved-card-icon'/>, <CgGym className='saved-card-icon'/>],
    selectedCard: -1,
    details: false
  }
  getSavedTemplates() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), location: "web" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/templates/workouts`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          console.log(r.templates)
          this.setState({ savedTemplates: r.templates })
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount() {
    this.getSavedTemplates();
  }
  select(index){
    if(this.state.selectedCard != index){
      this.setState({selectedCard: index})
    }
  }
  render() {
    return (
      <div className='page'>
        <h1 className='title'>Saved Workouts</h1>
        <div className={`saved-workouts${this.state.details == true ? " details":""}`}>
          {this.state.savedTemplates.map((template,index) => (
            <div className={`workout-card${this.state.selectedCard == index ? " selected-card":""}${this.state.details == true ? " card-detail":""}`} style={{animation: `card-load ${index/5}s`}}>
            <Card key={index} onClick={()=>this.select(index)}>
                {this.state.icons[Math.floor(Math.random()*this.state.icons.length)]}
                <div className='bottom'>
                  <h1>{template.name}</h1>
                </div>
                {this.state.details == false && <div>
                <Link to={"/workout"} onClick={()=> localStorage.setItem("started-workout", JSON.stringify(template))}><FaPlay className='control-btn interactable'/></Link>
                  <FaListUl className='control-btn interactable' onClick={()=> this.setState({details: !this.state.details})}/>
                  <MdDelete className='control-btn interactable'/>
                  </div>}
                  
                  {this.state.details && <div>
                    <IoChevronBackOutline  className='interactable' style={{fontSize: 50, backgroundColor: "var(--contrast)", borderRadius: "0px 0px 10px 0px", color: "white"}} onClick={()=> this.setState({details: !this.state.details})}/>
                {<ul className='exercises'>
                  {template.data.map((data,index) => (
                    <li className='exercise'>
                      <ol className='sets'>
                      <h2>{data.comment}</h2>
                      {JSON.parse(data.set_data).map((set,index) => (
                        <li style={{display: 'flex'}}>
                          <p>{set.reps}<PiArrowsCounterClockwise/></p>
                          <p>{set.weight}<GiWeight/></p>
                          <p>{set.time}<PiClockCountdown/></p>
                        </li>
                      ))
                          
                        }
                      </ol>
                    </li>
                  ))}
                </ul>}
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
