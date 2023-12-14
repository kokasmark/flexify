import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import { ReactComponent as Icon_remove } from './assets/icon-remove.svg';
import { ReactComponent as Icon_save } from './assets/icon-bookmark.svg';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';
import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import MusclesView from './MusclesView';
import { Card } from 'react-bootstrap';
import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      choosenGroup: '',
      exerciseNum: 0,
      exercises: []
    };
  }
  handleRepsChange = (event, index) => {
    const { value } = event.target;
    this.setState((prevState) => {
      const updatedExercises = [...prevState.exercises];
      updatedExercises[index] = Number(value); // Store the length for the specific card
      return { exercises: updatedExercises };
    });
  };
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
  addCard(){
    this.setState({exerciseNum: this.state.exerciseNum+1})
    this.setState({exercises: [...this.state.exercises, 0]})
  }
  render() {
    const exerciseCards = Array.from({ length: this.state.exerciseNum}).map((_, index) => (
      <div className='create-workout-card-parent'>

          <Card key={index} style={{ width: 300,border: 'white', boxShadow: '2px 2px 5px var(--shadow)' }} className='create-workout-card'>
            <Card.Body>
              <Card.Title>Exercise</Card.Title>
              <input
                style={{ width: 50 }}
                placeholder=''
                id={`create-reps-${index}`}
                onChange={(event) => this.handleRepsChange(event, index)}
              />
              <ol style={{maxHeight: 200, height: 200,marginTop: 20, overflow: 'auto'}}>
                {Array.from({ length: this.state.exercises[index] }).map((_, liIndex) => (
                  <li key={liIndex}> 
                    <Icon_reps style={{width:20, height:20}}/> <input style={{width: 40}}></input>
                    <Icon_weight  style={{width:20, height:20}}/> <input placeholder='kg' style={{width: 40}}></input>
                  </li>
                ))}
              </ol>
            </Card.Body>
            <Icon_remove style={{ width: 30, height: 30, position: 'relative', top: -300, left: 265 }} className='interactable'/>
        </Card>
      </div>
    ));
    return (
      <div className='page'>

        <div className='load-anim'>
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
                  <Icon_add className='interactable' onClick={()=>this.addCard()}/>
                  
                </div>
              </div>}
          </div>

        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(CreatePage);
