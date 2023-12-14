import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import { ReactComponent as Icon_remove } from './assets/icon-remove.svg';
import { ReactComponent as Icon_save } from './assets/icon-bookmark.svg';
import { ReactComponent as Icon_reps } from './assets/icon-reps.svg';
import { ReactComponent as Icon_weight } from './assets/icon-weight.svg';
import { ReactComponent as Icon_duration } from './assets/icon-duration.svg';
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
      exercises: [],
      exerciseTemplates: [],
      getTemplates: []
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
  getExerciseTemplates() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken') });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/templates/exercises", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ getTemplates: r.data });
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  chooseMuscleGroup = (g) => {
    if (g != null && g.name != '') {
      this.getExerciseTemplates();
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
  addCard(template = null) {
    this.setState((prevState) => ({
      exerciseNum: prevState.exerciseNum + 1,
      exercises: [...prevState.exercises, 0],
      exerciseTemplates: template ? [...prevState.exerciseTemplates, template] : [...prevState.exerciseTemplates, {name: 'Empty', type: 'rep'}]
    }));
  }
  selectTemplate(name, type) {
    // Create a new card data object with the given name and type
    const newCard = {
      name: name,
      type: type,
    };
  
    // Update the state to include the new card
    this.setState((prevState) => ({
      exercises: [...prevState.exercises, 0], // Assuming 0 initial exercises for the new card
      exerciseTemplates: [...prevState.exerciseTemplates, newCard],
    }));
  }
  deleteCard(index) {
    this.setState((prevState) => {
      const updatedExercises = [...prevState.exercises];
      updatedExercises.splice(index, 1);
  
      const updatedTemplates = [...prevState.exerciseTemplates];
      updatedTemplates.splice(index, 1);
  
      return {
        exerciseNum: prevState.exerciseNum - 1,
        exercises: updatedExercises,
        exerciseTemplates: updatedTemplates,
      };
    });
  }
  render() {
    const exerciseCards = this.state.exerciseTemplates.map((template, index) => (
      <div key={index} className='create-workout-card-parent'>
        <Card style={{ width: 300, border: 'white', boxShadow: '2px 2px 5px var(--shadow)' }} className='create-workout-card'>
          <Card.Body>
            {template.name != 'Empty' ? <Card.Title>{template.name}</Card.Title>:<Card.Title><input placeholder='name'/></Card.Title>}
            <input
              style={{ width: 50 }}
              placeholder=''
              id={`create-reps-${index}`}
              onChange={(event) => this.handleRepsChange(event, index)}
            />
            <ol style={{ maxHeight: 200, height: 200, marginTop: 20, overflow: 'auto' }}>
              {Array.from({ length: this.state.exercises[index] }).map((_, liIndex) => (
                <li key={liIndex} style={{textAlign: 'start'}}>
                  {template.type === 'rep' && <Icon_reps style={{ width: 20, height: 20 }} />}
                  {template.type === 'time' && <Icon_duration style={{ width: 20, height: 20 }} />}
                  <input style={{ width: 50 }} placeholder={template.type === 'time' && 'sec'}/>
                  {template.type === 'rep' && <div style={{display: 'inline-block'}}><Icon_weight style={{ width: 20, height: 20 }} /> <input placeholder='kg' style={{ width: 50 }} /></div>}
                </li>
              ))}
            </ol>
          </Card.Body>
          <Icon_remove style={{ width: 30, height: 30, position: 'relative', top: -320, left: 265 }} className='interactable' onClick={() => this.deleteCard(index)} />
        </Card>
      </div>
    ));
    return (
      <div className='page'>

        <div className='load-anim'>
          <MusclesView chooseCallback={this.chooseMuscleGroup} />
          <div style={{ color: 'white', position: 'relative', top: -800, left: '15%',backgroundColor: 'var(--contrast)', borderRadius: 10, height: 500, overflow: 'auto', width: 300 }}>
            <h1 style={{marginTop: 5, textAlign: 'center'}}>Templates</h1>
            {this.state.getTemplates.map((template, index) => (
              <div>
                {template.muscles.includes(this.state.choosenGroup) &&
                  <div onClick={()=> this.selectTemplate(template.name, template.type)} key={index} style={{backgroundColor: 'var(--contrast)', borderRadius: 5, marginLeft:'auto', marginRight:'auto', width:'80%',marginTop: 20
                  , height:60, textAlign: 'center', boxShadow: '5px 5px 15px var(--bg)'}} className='interactable load-anim'>
                    <h2>{template.name}</h2>
                    <p style={{marginTop: -10}}>({template.muscles.replaceAll("[","").replaceAll("]","").replaceAll('"',"")})</p>
                  </div>}
              </div>
            ))}
          </div>
          <div style={{ color: 'white', position: 'relative', top: -1300, left: '55%' }}>
            <div className='create-workout anim' ref={this.containerRef} style={{ position: 'relative', left: 50, textAlign: 'center' }}>
              <input id='create-name' style={{ display: 'inline-block' }} placeholder='Name'></input>
              <Icon_save className='interactable' title='Save Workout' />

              <div className="card-container">
              {exerciseCards}
              <Icon_add className='interactable' onClick={() => this.addCard()} />

              </div>
            </div>
          </div>
          
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(CreatePage);
