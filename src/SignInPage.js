import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

export default class SignInPage extends Component {


  render() {
    return (
      <div>
        <div className='sign-in-panel' style={{width: 400, height: 500, margin: 'auto', position: 'relative', top: 200}}>
          <h1 style={{color: 'white'}}>Hi, welcome back!</h1>
          <div>
            <p style={{color: 'white', fontWeight: 'bold', position: 'relative',top:15, left:-85}}>Email/Username</p>
            <input style={{width: 300, height: 30}}></input>
          </div>
          <div>
            <p style={{color: 'white', fontWeight: 'bold', position: 'relative',top:15, left:-110}}>Password</p>
            <input style={{width: 300, height: 30}} type='password'></input>
          </div>
        </div>
        
      </div>
    );
  }
}
