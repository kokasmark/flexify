import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import { ReactComponent as Icon_remove } from './assets/icon-remove.svg';
import { ReactComponent as Icon_save } from './assets/icon-bookmark.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import MusclesView from './MusclesView';
import { Card } from 'react-bootstrap';

export default class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      choosenGroup: '',
      exerciseNum: 0
    };
  }
  chooseMuscleGroup = (g) => {
    if (g != null && g.name != '') {
      try { this.setState({ choosenGroup: g.name }) } catch { }
      for (var i = 0; i < 220; i++) {
        if (g.group.includes(i)) {
          try { document.getElementById(i).style.fill = 'var(--heat-orange)'; } catch { continue; }
        } else {
          try { document.getElementById(i).style.fill = 'var(--heat-blue)'; } catch { continue; }
        }
      }
    }

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.exerciseNum !== this.state.exerciseNum) {
      // Scroll to the bottom when exerciseNum changes
      this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
    }
  }
  render() {
    const { exerciseNum } = this.state;

    // Create an array of the specified length (exerciseNum)
    const exerciseCards = Array.from({ length: this.state.exerciseNum }).map((_, index) => (
      <div className='create-workout-card-parent'>
        <Card key={index} style={{ width: 200,border: 'white'}} className='create-workout-card'>
          <Card.Body>
            <Card.Title>Exercise</Card.Title>
            <input style={{ width: 50 }} placeholder=''></input>
            <select>
              <option>Reps</option>
              <option>Seconds</option>
              <option>Minutes</option>
            </select>
            <p style={{ marginTop: 10, marginBottom: 1 }}>Description</p>
            <textarea></textarea>
          </Card.Body>
          <Icon_remove style={{width: 30,height:30, position:'relative', top:-180, left: 165}} className='interactable' onClick={()=>this.setState({exerciseNum: this.state.exerciseNum-1})}/>
        </Card>
      </div>
    ));
    return (
      <div>

        <div>
          <MusclesView chooseCallback={this.chooseMuscleGroup} />
          <div style={{ color: 'white', position: 'relative', top: -800, left: '55%' }}>
            {this.state.choosenGroup == '' ? <h1 >Choose a muscle group to train</h1> :

              <div className='create-workout anim' ref={this.containerRef} style={{ position: 'relative', left: 50, textAlign: 'center'}}>
                <h1>{this.state.choosenGroup.charAt(0).toUpperCase() + this.state.choosenGroup.slice(1)}  workout</h1>
                <input id='create-name'style={{display: 'inline-block'}} placeholder='Name'></input>
                <Icon_save className='interactable' title='Save Workout'/>

                <div className="card-container">
                  {exerciseCards.map((card, index) => (
                    <div key={index} className="create-workout-card">
                      {card}
                    </div>
                  ))}
                  <Icon_add className='interactable' onClick={()=>this.setState({exerciseNum: this.state.exerciseNum+1})}/>
                  
                </div>
              </div>}
          </div>

        </div>
        <Navbar />
        <Sidebar />
      </div>
    );
  }
}
