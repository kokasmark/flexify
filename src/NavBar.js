import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ReactComponent as Icon_streak } from './assets/icon-streak.svg';
import { ReactComponent as Icon_signIn } from './assets/icon-sign-in.svg';
import { ReactComponent as Icon_signOut } from './assets/icon-sign-out.svg';
import { ReactComponent as Icon_light } from './assets/icon-light.svg';
import { ReactComponent as Icon_dark } from './assets/icon-dark.svg';

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
  }
    render() {
      return (
        <div>
          <div className='navBar'>
            <div>
              {this.state.theme == 'light' && <Icon_dark onClick={this.changeTheme}/>}
              {this.state.theme == 'dark' && <Icon_light  onClick={this.changeTheme}/>}
            </div>
            <div style={{position: 'relative', left: '40%', top: -50}}>
              <Icon_streak />
              <p style={{display: 'inline-block', color: 'white', margin: 5}}>You are on a 0 day workout streak</p>

              <Link to="/signIn"><Icon_signIn className='interactable' style={{position: 'relative', left: '30vw'}}/></Link>
            </div>
          </div>
        </div>
      );
    }
  }