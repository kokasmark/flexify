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

const SignInWrapper = () => {
  const navigate = useNavigate();

  return <SignInPage navigate={navigate} />;
};
class SignInPage extends Component {

  state = {
    hidePassword: true
  }
  validate = () =>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"username": document.getElementById('username').value,
    "password": document.getElementById('password').value });

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
        if(r.success){
          localStorage.setItem('loginToken', r.token);
          console.log('Validating');
          const { navigate } = this.props;
          navigate('/');
        }else{
          alert('Error with credentials')
        }
      })
      .catch(error => console.log('error', error));
    }
  render() {
    return (
      <div>
        
        <div className='sign-in-panel' style={{width: 400, height: 500, margin: 'auto', position: 'relative', top: 400}}>
        <img src={logo} style={{position: 'absolute', marginLeft:-20,marginTop: -100}}/>
          <Icon_user style={{ width: 40, height: 40, marginRight: 10, position: 'relative', left: 5 }}/>
          <input id='username' placeholder='Username'></input>
          <br/>
          <Icon_key style={{width: 40, height: 40, marginRight: 10, position: 'relative', left: 5}}/>
          <input id='password' placeholder='Password' type={this.state.hidePassword == true ? 'password':'text'}></input>
          <div style={{width: 20, height: 20, position: 'relative', top: -35, left: 340}} className='interactable'  onClick={() => this.setState({hidePassword: !this.state.hidePassword})}>
            {this.state.hidePassword == false ? <Icon_view style={{width: 30, height: 30}} /> : <Icon_hide style={{width: 30, height: 30}}/>}
          </div>
          <Button style={{width: '80%', position: 'relative', left: 5}} onClick={this.validate}>Sign In</Button>
        </div>
        <Link to='/signup' style={{position: 'relative', left: 880, top: 100}}>Don't have an account?</Link>
      </div>
    );
  }
}
export default SignInWrapper;
