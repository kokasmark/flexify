import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_email } from './assets/icon-email.svg';
import Sidebar from './Sidebar';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import Navbar from './NavBar';

import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';
import {host} from './constants'
import { CallApi } from './api';

class AccountPage extends Component {
  state = {
    username: '',
    email: '',
    anatomy: (localStorage.getItem('anatomy') != null ? (localStorage.getItem('anatomy') == "Masculine" ? "Masculine": "Feminine") : "Masculine")
  }

  async getUserInformation(){
    var r = await CallApi("user", {token: localStorage.getItem('loginToken')})
    if(r.success){
      this.setState({username: r.username, email: r.email});
     }else{
       
     }
  }
  componentDidMount(){
    this.getUserInformation();
  }
  anatomySelect(text){
      if(text == "Masculine"){
        localStorage.setItem('anatomy', 'Masculine');
        this.setState({anatomy: 'Masculine'})
      }
      if(text == "Feminine"){
        localStorage.setItem('anatomy', 'Feminine');
        this.setState({anatomy: 'Feminine'})
      }
  }
  render() {
    return (
      <div className='page'>
        <div className='load-anim account-details' style={{color: 'white', textAlign: 'start', paddingTop: 100, paddingLeft: 50, 
        position: 'relative', top: 300,width: 300, height: 400, borderRadius: 10, left: '42%', border: '1px solid var(--contrast)'}}>
          <Icon_user/>
          <p style={{display: 'inline-block', fontWeight: 'bold'}}>{this.state.username}</p>
          <br/>
          <Icon_email/>
          <p style={{display: 'inline-block', fontWeight: 'bold'}}>{this.state.email}</p>
          <br />
          <p>Anatomy:</p>
          <div className='interactable' style={{position: 'relative', top: -40, left: 80, fontWeight: 'bold'}}>
          {this.state.anatomy == "Masculine" ? <p onClick={()=>this.anatomySelect("Feminine")}>Masculine</p> : <p onClick={()=>this.anatomySelect("Masculine")}>Feminine</p>}
          </div>
        </div>
        <NavBarWrapper />
        <Sidebar/>
      </div>
    );
  }
}
export default AuthRedirect(AccountPage);
