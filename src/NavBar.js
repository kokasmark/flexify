import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ReactComponent as Icon_streak } from './assets/icon-streak.svg';
import { ReactComponent as Icon_signIn } from './assets/icon-sign-in.svg';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_light } from './assets/icon-light.svg';
import { ReactComponent as Icon_dark } from './assets/icon-dark.svg';
import logo from './assets/logo.webp';

import {Link} from 'react-router-dom';
export default class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
     theme: 'light',
     username: '',
     email: ''
    };
  }
  changeTheme = ()=>{
      this.setState({theme: this.state.theme == 'light' ? 'dark' : 'light'})
      document.documentElement.style.setProperty('--contrast',this.state.theme == 'dark'? '#3C6FAA':'#1C1533');
      document.documentElement.style.setProperty('--bg',this.state.theme == 'dark'? '#1F2229':'#101218');
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

    fetch("http://localhost:3001/api/user", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if(r.success){
         this.setState({username: r.username, email: r.email});
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount(){
    this.getUserInformation();
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
            <div style={{position: 'relative', left: '40%', top: -50}}>
              <Icon_streak className='anim-heartbeat'/>
              <p style={{display: 'inline-block', color: 'white', margin: 5}}>You are on a 0 day workout streak</p>

              <div style={{color: 'white', position: 'relative', top: -50, left: '43%'}}>
              
              <Link to='/account'><Icon_user style={{position: 'relative', left: 200, width: 40, height: 40, margin: 5, paddingLeft: 10}} className='interactable'/></Link>
              <p style={{display: 'inline-block'}}>Welcome, <b>{this.state.username}</b></p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }