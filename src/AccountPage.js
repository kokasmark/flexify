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

class AccountPage extends Component {
  state = {
    username: '',
    email: '',
    anatomy: (localStorage.getItem('anatomy') != null ? (localStorage.getItem('anatomy') == "Masculine" ? "Masculine": "Feminine") : "Masculine")
  }

  getUserInformation(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"token": localStorage.getItem('loginToken'), location: "web"});

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
          
        }
      })
      .catch(error => console.log('error', error));
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
      console.log(localStorage.getItem('anatomy'))
  }
  changeTheme(e){
    const themes = [["#3C6FAA","#305886","#1F2229"],["#1DB954","#14863c","#191414"],["#515a5e","#41484d","#3a3d45"], ["#b94a68", "#991f35", "#671226"]]
    switch(e.target.value){
      default:
        document.documentElement.style.setProperty('--contrast', themes[0][0]);
        document.documentElement.style.setProperty('--darker-contrast', themes[0][1]);
        document.documentElement.style.setProperty('--bg', themes[0][2]);
        break;
      case "Flexify Blue":
        document.documentElement.style.setProperty('--contrast', themes[0][0]);
        document.documentElement.style.setProperty('--darker-contrast', themes[0][1]);
        document.documentElement.style.setProperty('--bg', themes[0][2]);
        break;
      case "Flexify Green":
        document.documentElement.style.setProperty('--contrast', themes[1][0]);
        document.documentElement.style.setProperty('--darker-contrast', themes[1][1]);
        document.documentElement.style.setProperty('--bg', themes[1][2]);
        break;
      case "Flexify Gray":
        document.documentElement.style.setProperty('--contrast', themes[2][0]);
        document.documentElement.style.setProperty('--darker-contrast', themes[2][1]);
        document.documentElement.style.setProperty('--bg', themes[2][2]);
        break;
      case "Flexify Crimson":
        document.documentElement.style.setProperty('--contrast', themes[3][0]);
        document.documentElement.style.setProperty('--darker-contrast', themes[3][1]);
        document.documentElement.style.setProperty('--bg', themes[3][2]);
        break;
    }
   
  }
  render() {
    return (
      <div className='page'>
        <div className='load-anim account-details' style={{color: 'white', textAlign: 'start', paddingTop: 140, paddingLeft: 50, 
        position: 'relative', top: 300, background: 'var(--contrast)',width: 300, height: 400, borderRadius: 10, left: '42%',boxShadow: '5px 5px 5px var(--shadow)'}}>
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
          <div>
            <p>Theme</p>
            <select onChange={(e) => this.changeTheme(e)}>
              <option>Flexify Blue</option>
              <option>Flexify Green</option>
              <option>Flexify Gray</option>
              <option>Flexify Crimson</option>
            </select>
          </div>
        </div>
        <NavBarWrapper />
        <Sidebar/>
      </div>
    );
  }
}
export default AuthRedirect(AccountPage);
