import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
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
        <div style={{color: 'white', textAlign: 'center', position: 'relative', top: 400}}>
          <p>Username: {this.state.username}</p>
          <p>Email: {this.state.email}</p>
        </div>
        <Navbar/>
        <Sidebar/>
      </div>
    );
  }
}
export default AuthRedirect(AccountPage);
