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

class AccountPage extends Component {
  state = {
    username: '',
    email: ''
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
          alert('Error!')
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount(){
    this.getUserInformation();
  }
  render() {
    return (
      <div className='page'>
        <div style={{color: 'white', textAlign: 'start', paddingTop: 140, paddingLeft: 50, 
        position: 'relative', top: 300, background: 'var(--contrast)',width: 300, height: 400, borderRadius: 10, left: '42%',boxShadow: '5px 5px 5px var(--shadow)'}}>
          <Icon_user/>
          <p style={{display: 'inline-block', fontWeight: 'bold'}}>{this.state.username}</p>
          <br/>
          <Icon_email/>
          <p style={{display: 'inline-block', fontWeight: 'bold'}}>{this.state.email}</p>
        </div>
        <Navbar/>
        <Sidebar/>
      </div>
    );
  }
}
export default AuthRedirect(AccountPage);
