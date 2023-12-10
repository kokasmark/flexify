import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ReactComponent as Icon_home } from './assets/icon-home.svg';
import { ReactComponent as Icon_calendar } from './assets/icon-calendar.svg';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import { ReactComponent as Icon_search } from './assets/icon-search.svg';
import { ReactComponent as Icon_chart } from './assets/icon-chart.svg';
import { ReactComponent as Icon_saved } from './assets/icon-bookmark.svg';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';

import {Link} from 'react-router-dom';
export default class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

    render() {
      return (
        <div>
          <div className='sidebar'>
            <ul style={{ listStyle: 'none' }}>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/"><Icon_home style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Home</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -29 }}>
                    <Link to="/plan"><Icon_calendar style={{width: 40, height: 40}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300', marginLeft: 2}}>Plan</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/create"><Icon_add style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Create Workout</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/browse"><Icon_search style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Browse Workouts</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -55, marginBottom:-40 }}>
                    <Link to="/diet"><Icon_chart style={{width: 90, height: 90}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300', position: 'relative', top: -20, left: -20 }}>Diet</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/saved"><Icon_saved style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Saved Workouts</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/account"><Icon_user style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>My Account</p></Link>
                </li>
            </ul>
          </div>

        </div>
      );
    }
  }