import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ReactComponent as Icon_streak } from './assets/icon-streak.svg';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_light } from './assets/icon-light.svg';
import { ReactComponent as Icon_dark } from './assets/icon-dark.svg';
import logo from './assets/logo.webp';

import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import {host} from './constants'

import GetString from './language';


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
  
    for (let i = 0; i < sortedDates.length; i++) {

        const daysdiff = new Date(sortedDates[i]).getDate() - new Date(sortedDates[i-1]).getDate()
        if(daysdiff > 2){
          streak = 0;
        }else{
          streak++;
        }
      
    }
  
    console.log("Streak:", streak);
    this.setState({ streak: streak });
  }
  
  
  
  getWorkouts() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), date: this.state.dateForApi });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`http://${host}:3001/api/workouts/date`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ dates: r.dates });
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  changeTheme = ()=>{
      this.setState({theme: this.state.theme == 'light' ? 'dark' : 'light'})
      document.documentElement.style.setProperty('--contrast',this.state.theme == 'dark'? '#3C6FAA':'#163457');
      //document.documentElement.style.setProperty('--bg',this.state.theme == 'dark'? '#1F2229':'#101218');
  }
  getUserInformation(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"token": localStorage.getItem('loginToken')});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/user`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if(r.success){
         this.setState({username: r.username, email: r.email});
        }else{
          swal("Oops!", "You have been logged out!", "error");
          this.props.navigate('/login');
        }
      })
      .catch(error => console.log('error', error));
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
    /*swal("Change language?", "This will reload the page! All unsaved changes will be deleted!", "warning").then((result)=> {

      console.log(result)
      if(result){
        localStorage.setItem('lang',localStorage.getItem('lang') == 'HU' ? 'EN':'HU');
   
        console.log('Switching language');
        window.location.reload();
      }
    
    });*/
    swal({
      title: "Change language?",
      text: 'This will reload the page! All unsaved changes will be deleted!',
      buttons: ["No, dont change it!","Yes, change it!"],
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
          <Link to="/" draggable='false'><img className='interactable' src={logo} style={{position: 'fixed', top: -15, left: -110, transform: 'scale(0.3)'}} draggable='false'/></Link> 
            <div>
              {this.state.theme == 'light' && <Icon_dark className='interactable' onClick={this.changeTheme}/>}
              {this.state.theme == 'dark' && <Icon_light className='interactable' onClick={this.changeTheme}/>}
            </div>
            <div style={{color: 'white', position: 'relative', top: -40, left: 50, marginBottom: -40, width: 50, height: 50}} >
              {this.state.language == 'HU' && <h5 onClick={() => this.switchLanguage()} className='interactable'>EN</h5>}
              {this.state.language == 'EN' && <h5 onClick={() => this.switchLanguage()} className='interactable'>HU</h5>}
            </div>
            <div style={{position: 'relative', left: '40%', top: -60}}>
              <Icon_streak className='anim-heartbeat'/>
              <p style={{display: 'inline-block', color: 'white', margin: 5}}>{GetString("streak-start")}<b style={{color: 'var(--heat-orange)'}}>{this.state.streak}</b> {GetString("streak-end")}</p>

              <div style={{color: 'white', position: 'relative', top: -50, left: '43%'}}>
              
              <Link to='/account'><Icon_user style={{position: 'relative', left: 200, width: 40, height: 40, margin: 5, paddingLeft: 10}} className='interactable'/></Link>
              <p style={{display: 'inline-block', marginLeft: -10}}>{GetString("navbar-welcome")} <b>{this.state.username}</b></p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  export default NavBarWrapper;