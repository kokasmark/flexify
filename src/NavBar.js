import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ReactComponent as Icon_streak } from './assets/icon-streak.svg';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_light } from './assets/icon-light.svg';
import { ReactComponent as Icon_dark } from './assets/icon-dark.svg';
import { ReactComponent as Icon_hu } from './assets/icon-hu.svg';
import { ReactComponent as Icon_en } from './assets/icon-en.svg';
import logo from './assets/logo.webp';

import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import {host} from './constants'

import GetString from './language';
import { CallApi } from './api';


const NavBarWrapper = () => {
  const navigate = useNavigate();

  return <Navbar navigate={navigate} />;
};

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
     theme: 'light',
     username: '',
     email: '',
     dates: [],
     streak: 0,
     dateForApi: new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
     language: 'HU'
    };
  }
  computeStreak() {
    const workoutDates = this.state.dates;
  
    if (!workoutDates || workoutDates.length === 0) {
      return 0; // No workouts, streak is 0
    }
  
    // Sort dates using a compare function
    const sortedDates = workoutDates.sort((a, b) => new Date(a) - new Date(b));
  
    let streak = 0;
    // Include today's date in the comparison
    const today = new Date();
  
    sortedDates.push(today);
    console.log(sortedDates)
    if(sortedDates.length === 1) streak = 1
    for (let i = 1; i < sortedDates.length; i++) {

        const daysdiff = new Date(sortedDates[i].date).getDate() - new Date(sortedDates[i-1].date).getDate()
        if(daysdiff > 2){
          streak = 0;
        }else{
          streak++;
        }
        console.log(sortedDates[i].date, streak)
    }
    
    this.setState({ streak: streak });
  }
  
  
  
  async getWorkouts() {
    var r = await CallApi("workouts/finished", {token: localStorage.getItem('loginToken')})
    if (r.success) {
      this.setState({ dates: r.dates });
    } else {

    }
  }
  async getUserInformation(){
    if(localStorage.getItem('loginToken') != "" && localStorage.getItem('loginToken') != null){
    var r = await CallApi("user", {token: localStorage.getItem('loginToken')})
    if(r.success){
      this.setState({username: r.username, email: r.email});
     }else{
       swal(GetString("alert-logged-out")[0],GetString("alert-logged-out")[1], "error");
       this.props.navigate('/login');
     }
    }
  }
  componentDidMount(){
    this.getUserInformation();
    var c = document.documentElement.style.getPropertyValue('--contrast');
    this.setState({theme: c == '#3C6FAA' ? 'light':'dark'})
    this.getWorkouts();//Gets the dates for the streak calculation


    if(localStorage.getItem('lang')){
      this.setState({language: localStorage.getItem('lang')});
    }
    else{
      localStorage.setItem('lang','HU')
    }
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.dates != this.state.dates){
      this.computeStreak();
    }
  }
  isDesktop(){
    if(window.innerWidth > 1224){
      return true;
    }
    else{
      return false;
    }
  }
  switchLanguage(){
    swal({
      title: GetString("alert-change-language")[0],
      text: GetString("alert-change-language")[1],
      buttons: [GetString("alert-change-language")[2],GetString("alert-change-language")[3]],
      icon: 'warning'
    }).then((result) => {
      if(result){
        localStorage.setItem('lang',localStorage.getItem('lang') == 'HU' ? 'EN':'HU');
   
        console.log('Switching language');
        window.location.reload();
      }
    });
    
  }
    render() {
      return (
        <div>
          <div className='navBar'>
          <Link to="/" draggable='false' className='flexify-logo'><img className='interactable' src={logo} style={{position: 'fixed', top: -15, left: -110, transform: 'scale(0.3)'}} draggable='false'/></Link> 
            <div>
              {this.state.theme == 'light' && <Icon_dark style={{visibility: 'hidden'}}/>}
              {this.state.theme == 'dark' && <Icon_light style={{visibility: 'hidden'}}/>}
            </div>
            <div style={{color: 'white', position: 'relative', top: -40, left: 20, marginBottom: -40, width: 50, height: 50}} >
              {this.state.language == 'HU' && <Icon_hu style={{width: 30, height: 30}} onClick={() => this.switchLanguage()} className='interactable'/>}
              {this.state.language == 'EN' && <Icon_en style={{width: 30, height: 30}} onClick={() => this.switchLanguage()} className='interactable'/>}
            </div>
            <div className='navbar-streak' style={{position: 'relative', left: '40%', top: -60}}>
              <Icon_streak className='anim-heartbeat'/>
              <p style={{display: 'inline-block', color: 'white', margin: 5}}>{GetString("streak-start")}<b style={{color: 'var(--heat-orange)'}}>{this.state.streak}</b> {GetString("streak-end")}</p>

              <div className='navbar-welcome-container' style={{color: 'white', position: 'relative', top: -50, left: '43%'}}>
              
              <Link to='/account'><Icon_user style={{position: 'relative', left: 200, width: 40, height: 40, margin: 5, paddingLeft: 10}} className='interactable'/></Link>
              <p className='navbar-welcome' style={{display: 'inline-block', marginLeft: -10}}>{GetString("navbar-welcome")} <b>{this.state.username}</b></p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  export default NavBarWrapper;