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

import { ReactComponent as Icon_sign_out } from './assets/icon-sign-out.svg';

import {Link} from 'react-router-dom';

import GetString from './language';
export default class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signOut: false
    };
  }

  signOut(){
    localStorage.removeItem('loginToken');
    this.setState({signOut: true})
  }
    render() {
      return (
        <div>
          <div className='sidebar'>
            <ul style={{ listStyle: 'none' }}>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/"><Icon_home style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-home')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -29 }}>
                    <Link to="/plan"><Icon_calendar style={{width: 40, height: 40}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300', marginLeft: 2}}>{GetString('page-plan')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/create"><Icon_add style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-create')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/browse"><Icon_search style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-browse')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -55, marginBottom:-40 }}>
                    <Link to="/diet"><Icon_chart style={{width: 90, height: 90}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300', position: 'relative', top: -20, left: -20 }}>{GetString('page-diet')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/saved"><Icon_saved style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-saved')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33 }}>
                    <Link to="/account"><Icon_user style={{width: 48, height: 48}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-account')}</p></Link>
                </li>
                <li className='interactable' style={{ marginLeft: -33, marginTop: 300 }}>
                    <Link to="/login" onClick={this.signOut}><Icon_sign_out style={{width: 40, height: 40, marginRight: 10}}/>
                    <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Sign out</p></Link>
                </li>
            </ul>
          </div>

        </div>
      );
    }
  }