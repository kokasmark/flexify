import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className='timePeriod'>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 25px", fontWeight: 'bold'}}>Weekly</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>Monthly</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>6 Months</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>1 Year</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 25px 4px 4px"}}>All</p>
        </div>
        <div className='muscles'>
          <Muscles />
        </div>
      </div>
    );
  }
}
