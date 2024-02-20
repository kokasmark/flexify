import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

import Sidebar from './Sidebar';

import 'react-calendar/dist/Calendar.css';

import AuthRedirect from './authRedirect';
import { Card, CardBody } from 'react-bootstrap';
import NavBarWrapper from './NavBar';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';
import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';
import { ReactComponent as Icon_duration } from './assets/icon-duration.svg';
import { ReactComponent as Icon_copy } from './assets/icon-copy.svg';
import { Link } from 'react-router-dom';

import {host} from './constants'


class SavedPage extends Component {
  state = {
    savedTemplates: [],
    current: 2,
    direction:  [" furthest", " far", " closest", " close"]
  }
  getSavedTemplates() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), location: "web" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/templates/workouts`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          console.log(r.templates)
          this.setState({ savedTemplates: r.templates })
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount() {
    this.getSavedTemplates();
  }
  scrollCards(e){
    var prevValue = this.state.current;
    var direction = []
    if((this.state.current >= 0 && this.state.current <= this.state.savedTemplates.length-1)){
      direction = e.deltaY == -100? [" furthest", " far", " closest", " close"]:[" close", " closest", " far", " furthest"]
    var value = this.state.current + (e.deltaY == -100? 1:-1)
    if(value < 0){
      value = 0
    }
    if(value > this.state.savedTemplates.length-1){
      value = this.state.savedTemplates.length-1
    }
    this.setState({current: value, direction: direction})}
  }
  render() {
    return (
      <div className='page'>

        {this.state.savedTemplates.length > 0 && <div className='saved-workouts' onWheel={(e)=>this.scrollCards(e)}>
          {(this.state.current >= 2 && this.state.current <= this.state.savedTemplates.length - 3) &&
          <div>
            <Card className={'saved-card' + this.state.direction[0]}  key={Math.random()} style={this.state.current != 0 &&{opacity: 0.25, transform: "scale(0.8)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-2].name}</h1>
            </CardBody>
          </Card>
          <Card className={'saved-card' + this.state.direction[1]}  key={Math.random()} style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-1].name}</h1>
            </CardBody>
          </Card>
          <Card className={'saved-card-current'} key={Math.random()}>
            <CardBody>
              <p>{this.state.current}</p>
              <h1>{this.state.savedTemplates[this.state.current].name}</h1>
            </CardBody>
          </Card>
          <Card className={'saved-card' + this.state.direction[2]}  key={Math.random()} style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+1].name}</h1>
            </CardBody>
          </Card>
          <Card className={'saved-card'  + this.state.direction[3]}  key={Math.random()} style={{opacity: 0.25, transform: "scale(0.8)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+2].name}</h1>
            </CardBody>
          </Card>
            </div>}

            {(this.state.current == 1) &&
          <div>
            <Card className='saved-card' style={this.state.current != 0 &&{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-1].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card-current' >
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+1].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.25, transform: "scale(0.8)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+2].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.15, transform: "scale(0.7)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+3].name}</h1>
            </CardBody>
          </Card>
            </div>}
            {(this.state.current == 0) &&
          <div>
            <Card className='saved-card-current'>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card 'style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+1].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.25, transform: "scale(0.8)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+2].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.15, transform: "scale(0.7)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+3].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.1, transform: "scale(0.6)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+4].name}</h1>
            </CardBody>
          </Card>
            </div>}

            {(this.state.current == this.state.savedTemplates.length-2) &&
          <div>
            <Card className='saved-card' style={{opacity: 0.15, transform: "scale(0.7)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-3].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card 'style={{opacity: 0.25, transform: "scale(0.8)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-2].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-1].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card-current'>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current+1].name}</h1>
            </CardBody>
          </Card>
            </div>}
            {(this.state.current == this.state.savedTemplates.length-1) &&
          <div>
            <Card className='saved-card' style={{opacity: 0.15, transform: "scale(0.6)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-4].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card 'style={{opacity: 0.25, transform: "scale(0.7)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-3].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.5, transform: "scale(0.8)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-2].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card' style={{opacity: 0.5, transform: "scale(0.9)"}}>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current-1].name}</h1>
            </CardBody>
          </Card>
          <Card className='saved-card-current'>
            <CardBody>
              <h1>{this.state.savedTemplates[this.state.current].name}</h1>
            </CardBody>
          </Card>
            </div>}
        </div>}
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(SavedPage);
