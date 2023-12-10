import './App.css';
import { Component } from 'react';
import logo from './assets/logo.webp';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_key } from './assets/icon-key.svg';
import { ReactComponent as Icon_view } from './assets/icon-view.svg';
import { ReactComponent as Icon_hide } from './assets/icon-view-hide.svg';
import { ReactComponent as Icon_email } from './assets/icon-email.svg';
import { Button } from 'react-bootstrap';
import { Link  } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignUpWrapper = () => {
  const navigate = useNavigate();

  return <SignUpPage navigate={navigate} />;
};

class SignUpPage extends Component {

  state = {
    hidePassword: true
  }
  validate = () =>{
    //fetch api a responsetol fugg mi kovetkezik jelenleg csak a home pagere dob át
    console.log('Validating');
    const { navigate } = this.props;
    navigate('/');
    }
  render() {
    return (
      <div>
        
        <div className='sign-in-panel' style={{width: 400, height: 500, margin: 'auto', position: 'relative', top: 400}}>
        <img src={logo} style={{position: 'absolute', marginLeft:-20,marginTop: -100}}/>
          <Icon_user/>
          <input placeholder='Username'></input>
          <br />
          <Icon_email style={{width: 40, height: 40, marginRight:10, position: 'relative', left: 5}}/>
          <input placeholder='Email'></input>
          <br/>
          <Icon_key style={{width: 40, height: 40, marginRight: 10, position: 'relative', left: 5}}/>
          <input placeholder='Password' type={this.state.hidePassword == true ? 'password':'text'}></input>
          <div style={{width: 20, height: 20, position: 'relative', top: -40, left: 340}} className='interactable'  onClick={() => this.setState({hidePassword: !this.state.hidePassword})}>
            {this.state.hidePassword == false ? <Icon_view style={{width: 30, height: 30}} /> : <Icon_hide style={{width: 30, height: 30}}/>}
          </div>
          <Button style={{width: '80%',position: 'relative' , left: 5}} onClick={this.validate}>Sign Up</Button>
         
        </div>
        <Link to='/signIn' style={{position: 'relative', left: 875, top: 100}}>Already have an account?</Link>
      </div>
    );
  }
}
export default SignUpWrapper;