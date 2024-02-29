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
import { IoIosSettings } from "react-icons/io";

import { ReactComponent as Icon_sign_out } from './assets/icon-sign-out.svg';

import { Link } from 'react-router-dom';

import GetString from './language';

import { CallApi } from './api';
export default class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }
  async getUserInformation() {
    var r = await CallApi("user", { token: localStorage.getItem('loginToken') })
    if (r.success) {
      this.setState({ isAdmin: r.isAdmin == 1 });
    }
  }
  componentDidMount() {
    this.getUserInformation()
  }
  signOut() {
    localStorage.removeItem('loginToken');
    this.setState({ signOut: true })
  }
  render() {
    return (
      <div>
        <div className='sidebar'>
          <ul style={{ listStyle: 'none' }}>
            <Link to="/"><li className='interactable' style={{ marginLeft: -33 }}>
              <Icon_home style={{ width: 48, height: 48 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-home')}</p>
            </li></Link>
            <Link to="/plan"><li className='interactable' style={{ marginLeft: -29 }}>
              <Icon_calendar style={{ width: 40, height: 40 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300', marginLeft: 2 }}>{GetString('page-plan')}</p>
            </li></Link>
            <Link to="/create"><li className='interactable' style={{ marginLeft: -33 }}>
              <Icon_add style={{ width: 48, height: 48 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-create')}</p>
            </li></Link>
            <Link to="/browse"><li className='interactable' style={{ marginLeft: -33 }}>
              <Icon_search style={{ width: 48, height: 48 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-browse')}</p>
            </li></Link>
            <Link to="/diet"><li className='interactable' style={{ marginLeft: -55, height: 50 }}>
              <Icon_chart style={{ width: 90, height: 90 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300', position: 'relative', top: -20, left: -20 }}>{GetString('page-diet')}</p>
            </li></Link>
            <Link to="/saved"><li className='interactable' style={{ marginLeft: -33 }}>
              <Icon_saved style={{ width: 48, height: 48 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-saved')}</p>
            </li></Link>
            <Link to="/account"><li className='interactable' style={{ marginLeft: -33 }}>
              <Icon_user style={{ width: 48, height: 48 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>{GetString('page-account')}</p>
            </li></Link>
            {this.state.isAdmin &&
              <Link to="/admin"><li className='interactable' style={{ marginLeft: -33 }}>
                <IoIosSettings style={{ width: 48, height: 40, color: 'white'}} />
                <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Admin</p>
              </li></Link>
            }
            <Link to="/login" onClick={this.signOut}><li className='interactable sidebar-sign-out' style={{ marginLeft: -33, marginTop: this.state.isAdmin ? 260 : 300 }}>
              <Icon_sign_out style={{ width: 40, height: 40, marginRight: 10 }} />
              <p style={{ display: 'inline-block', color: 'white', fontWeight: '300' }}>Sign out</p>
            </li></Link>

          </ul>
        </div>

      </div>
    );
  }
}