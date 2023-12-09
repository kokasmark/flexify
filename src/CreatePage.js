import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import MusclesView from './MusclesView';

export default class CreatePage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div>
          <MusclesView/>
        </div>
      </div>
    );
  }
}
