import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';

export default class CreatePage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className='muscles'>
          <Muscles />
        </div>
      </div>
    );
  }
}
