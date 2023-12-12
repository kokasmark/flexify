import './App.css';
import { Component } from 'react';
import logo from './assets/logo.webp';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_key } from './assets/icon-key.svg';
import { ReactComponent as Icon_view } from './assets/icon-view.svg';
import { ReactComponent as Icon_hide } from './assets/icon-view-hide.svg';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import screenshot1 from './assets/screenshot1.png';
import screenshot2 from './assets/screenshot2.png';
import screenshot3 from './assets/screenshot3.png';

const SignInWrapper = () => {
  const navigate = useNavigate();

  return <SignInPage navigate={navigate} />;
};
class SignInPage extends Component {

  state = {
    hidePassword: true
  }
  validate = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "username": document.getElementById('username').value,
      "password": document.getElementById('password').value
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/login", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          localStorage.setItem('loginToken', r.token);
          console.log('Validating');
          const { navigate } = this.props;
          navigate('/');
        } else {
          alert('Error with credentials')
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <div>

        <div className='sign-in-panel' style={{ width: 400, height: 500, margin: 'auto', position: 'relative', top: 400, zIndex:10 }}>
          <img src={logo} style={{ position: 'absolute', marginLeft: -20, marginTop: -100 }} />
          <Icon_user style={{ width: 40, height: 40, marginRight: 10, position: 'relative', left: 5 }} />
          <input id='username' placeholder='Username'></input>
          <br />
          <Icon_key style={{ width: 40, height: 40, marginRight: 10, position: 'relative', left: 5 }} />
          <input id='password' placeholder='Password' type={this.state.hidePassword == true ? 'password' : 'text'}></input>
          <div style={{ width: 20, height: 20, position: 'relative', top: -35, left: 340 }} className='interactable' onClick={() => this.setState({ hidePassword: !this.state.hidePassword })}>
            {this.state.hidePassword == false ? <Icon_view style={{ width: 30, height: 30 }} /> : <Icon_hide style={{ width: 30, height: 30 }} />}
          </div>
          <Button style={{ width: '80%', position: 'relative', left: 5 }} onClick={this.validate}>Sign In</Button>
        </div>
        <Link to='/signup' style={{ position: 'relative', left: 880, top: 100, zIndex:10 }}>Don't have an account?</Link>
        <div style={{ transform: 'rotate3d(1, -1, 1, 45deg)' }}>
          <img src={screenshot1} style={{ transform: 'scale(0.25)', position: 'relative', top: -850, left: 300, boxShadow: '30px 30px 15px var(--shadow)', filter: 'brightness(1.1)' }} />
        </div>

        <div style={{ transform: 'rotate3d(-1, -1, 1, -45deg)', position: 'relative', top: -1300, left: -600 }}>
          <img src={screenshot2} style={{ transform: 'scale(0.28)', boxShadow: '-30px 30px 15px var(--shadow)', filter: 'brightness(1.1)' }} />
        </div>
        <div style={{ position: 'relative', top: -1750, left: 1450, color: 'white', width: 400, textAlign: 'right'}}>
          <h1>Manage</h1>
          <p>With our application, you can effortlessly manage your diet, track workouts, and plan your fitness journey. Achieve your health goals with precision and simplicity, making every step towards a healthier lifestyle a guided and rewarding experience.</p>
        </div>
        <div style={{ position: 'relative', top: -2300, left: 50, color: 'white', width: 400 }}>
          <h1>Create</h1>
          <p>Craft your ideal fitness routine effortlessly with our app. Browse, customize, and save exercises with ease. Take control of your workouts, creating plans tailored to your fitness goals.</p>
        </div>
      </div>
    );
  }
}
export default SignInWrapper;
