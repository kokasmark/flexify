import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ReactComponent as Icon_streak } from './assets/icon-streak.svg';
import { ReactComponent as Icon_signIn } from './assets/icon-sign-in.svg';
import { ReactComponent as Icon_signOut } from './assets/icon-sign-out.svg';
import { ReactComponent as Icon_light } from './assets/icon-light.svg';
import { ReactComponent as Icon_dark } from './assets/icon-dark.svg';
import logo from './assets/logo.webp';

import {Link} from 'react-router-dom';
export default class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
     theme: 'light'
    };
  }
  changeTheme = ()=>{
      this.setState({theme: this.state.theme == 'light' ? 'dark' : 'light'})
      document.documentElement.style.setProperty('--contrast',this.state.theme == 'dark'? '#3C6FAA':'#1C1533');
      document.documentElement.style.setProperty('--bg',this.state.theme == 'dark'? '#1F2229':'#101218');
  }
    render() {
      return (
        <div>
          <div className='navBar'>
          <Link to="/"><img className='interactable' src={logo} style={{position: 'fixed', top: -15, left: -110, transform: 'scale(0.3)'}}/></Link> 
            <div>
              {this.state.theme == 'light' && <Icon_dark className='interactable' onClick={this.changeTheme}/>}
              {this.state.theme == 'dark' && <Icon_light className='interactable' onClick={this.changeTheme}/>}
            </div>
            <div style={{position: 'relative', left: '40%', top: -50}}>
              <Icon_streak className='anim-heartbeat'/>
              <p style={{display: 'inline-block', color: 'white', margin: 5}}>You are on a 0 day workout streak</p>

              <Link to="/signIn" style={{width:50,height:50,position: 'relative', left: '30vw'}}><Icon_signIn className='interactable'/></Link>
            </div>
          </div>
        </div>
      );
    }
  }