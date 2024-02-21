import logo from './logo.svg';
import './App.css';
import React, { Component, useEffect, useState } from 'react';
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
import swal from 'sweetalert';

import { useLocation } from 'react-router-dom';
import GetString from './language';
import { host } from './constants';

const CreatePageWrapper = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (location.search && location.search !== '') {
      setSearchValue(location.search);
    }
  }, [location]);

  // Render CreatePage component with the search prop
  return <CreatePage import={searchValue} />;
};

class CreatePage extends Component {
  muscleRef = React.createRef();
  cardRef = React.createRef();
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      choosenGroup: '',
      exerciseNum: 0,
      exercises: [],
      exerciseTemplates: [],
      getTemplates: [],
      offsetX: 0,
      offsetY: 0,
      currentTemplateGrabbed: '',
      savedTemplates: [],
      importName: '',
      importedWorkout: '',
      importActions: 0,
      importDone: false
    };
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
          this.setState({ savedTemplates: r.templates })
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  handleRepsChange = (event, index, gvalue) => {
    const value  = gvalue != null ? gvalue : event.target.value;
    if ( value < 0){
      value = 0;
      document.getElementById(`create-reps-${index}`).value = 0;
    }
    if ( value > 20){
      value = 20;
      document.getElementById(`create-reps-${index}`).value = 20;
    }
    this.setState((prevState) => {
      const updatedExercises = [...prevState.exercises];
      updatedExercises[index] = Number(value); // Store the length for the specific card
      return { exercises: updatedExercises };
    });
  };
  getExerciseTemplates() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), location: "web" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/templates/exercises`, requestOptions)
      .then(response => response.text())
      .then((response) => {
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
  parseSearchString = (search) => {
    const decodedString = decodeURIComponent(search); // Decoding URL-encoded characters
    const queryString = decodedString.substring(1); // Removing the leading "?" character
    const params = new URLSearchParams(queryString);

    return queryString;
  };

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.import != this.props.import) {
      console.log('Importing workout: ' + this.props.import);
    }

    if (prevState.importedWorkout != this.state.importedWorkout) {
      if (!this.state.importDone) {
        for (var i = 0; i < this.state.importedWorkout.data.length; i++) {
          document.getElementById(`create-reps-${i}`).value = JSON.parse(this.state.importedWorkout.data[i].set_data).length;

        }
        const updatedExercises = [...prevState.exercises];
        for (var i = 0; i < this.state.importedWorkout.data.length; i++) {
          const l = JSON.parse(this.state.importedWorkout.data[i].set_data).length;

          updatedExercises[i] = Number(l);

        }
        this.setState({ exercises: updatedExercises });
      }
    }
    if (prevState.savedTemplates !== this.state.savedTemplates) {
      if (this.props.import.length > 0) {
        if (!this.state.importDone) {
          const matchingWorkout = this.state.savedTemplates.find((workout) =>
            workout.name === this.parseSearchString(this.props.import)
          );
          this.setState({ importedWorkout: matchingWorkout })
          document.getElementById('create-name').value = matchingWorkout.name + ' Copy';

          for (var i = 0; i < matchingWorkout.data.length; i++) {
            this.addCard({ name: matchingWorkout.data[i].comment, type: JSON.parse(matchingWorkout.data[i].set_data)[0].reps != 0 ? 'rep' : 'time', exercise_template_id: matchingWorkout.data[i].exercise_template_id})
          }
        }
      } else {
        console.log('There is nothing to import!');
        this.setState({ importDone: true });
      }
    }
    if (prevState.exercises != this.state.exercises) {
      if (!this.state.importDone) {
        var a = 0;
        for (var i = 0; i < this.state.exercises.length; i++) {
          a++;
          for (var ii = 0; ii < this.state.exercises[i]; ii++) {
            try {
              document.getElementById(i + "-" + ii + "-rep").value = JSON.parse(this.state.importedWorkout.data[i].set_data)[ii].reps;
              document.getElementById(i + "-" + ii + "-weight").value = JSON.parse(this.state.importedWorkout.data[i].set_data)[ii].weight;
            } catch {
              document.getElementById(i + "-" + ii + "-rep").value = JSON.parse(this.state.importedWorkout.data[i].set_data)[ii].time;
            }

          }
        }
        this.setState({ importActions: a })
      }
    }
    if (prevState.importActions != this.state.importActions) {
      if (this.state.importActions == this.state.importedWorkout.data.length) {
        this.setState({ importDone: true })
        swal(GetString("alert-workout-imported")[0], this.state.importedWorkout.name + GetString("alert-workout-imported")[1], 'success')
      }
    }
  }
  addCard(template = null) {
      if(this.state.exerciseNum < 50){
          this.setState((prevState) => ({
        exerciseNum: prevState.exerciseNum + 1,
        exercises: [...prevState.exercises, 0],
        exerciseTemplates: template ? [...prevState.exerciseTemplates, template] : [...prevState.exerciseTemplates, { name: 'Empty', type: 'rep' }]
      }));
    }else{
      swal("Error!", "Too many exercise cards!\n(limit: 50)","error")
    }
  }
  selectTemplate(name, type, id) {
    // Create a new card data object with the given name and type
    const newCard = {
      name: name,
      type: type,
      id: id
    };
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
  colorAffectedMuscles(muscles, leave) {
    var affected = JSON.parse(muscles);

    for (const groupName in this.muscleRef.current.getGroup()) {
      this.muscleRef.current.updateMuscleGroup(groupName, 0);
    }
    this.muscleRef.current.updateMuscleGroup(this.state.choosenGroup, 2);
    if (!leave) {
      for (var i = 0; i < affected.length; i++) {
        if (affected[i] != this.state.choosenGroup) {
          this.muscleRef.current.updateMuscleGroup(affected[i], 1);
        }
      }

    }
  }


  drag = (e) => {
    const { offsetX, offsetY } = this.state;
    this.cardRef.current.style.position = 'relative';
    this.cardRef.current.style.left = `${e.clientX - offsetX}px`;
    this.cardRef.current.style.top = `${e.clientY - offsetY}px`;
  };

  dragStart = (e, index, template) => {
    e.dataTransfer.setData('text/plain', index.toString());
    this.setState({ currentTemplateGrabbed: template })
  };
  dragEnd = (e) => {
    this.setState({ currentTemplateGrabbed: '' })
  };
  dragOver = (e) => {
    e.preventDefault();
  };

  drop = (e) => {
    e.preventDefault();
    const index = parseInt(e.dataTransfer.getData('text/plain'));
    // Implement logic to handle the drop, e.g., reorder cards
    // For simplicity, let's assume you want to move the card to the end
    this.setState((prevState) => {
      const updatedTemplates = [...prevState.exerciseTemplates];
      const movedCard = updatedTemplates.splice(index, 1)[0];
      updatedTemplates.push(movedCard);
      
      return { exerciseTemplates: updatedTemplates};
    });

  };
  createWorkoutDrop = (e) => {
    e.preventDefault();

    this.addCard(this.state.currentTemplateGrabbed);
  };

  saveWorkout() {

    var data = [
    ]

    for (var i = 0; i < this.state.exercises.length; i++) {
      var set_data = [];
      for (var ii = 0; ii < this.state.exercises[i]; ii++) {
        if (this.state.exerciseTemplates[i].type == 'rep') {
          set_data.push({ reps: document.getElementById(i + "-" + ii + "-rep").value, weight: document.getElementById(i + "-" + ii + "-weight").value, time: 0 })
        } else if (this.state.exerciseTemplates[i].type == 'time') {
          set_data.push({ time: document.getElementById(i + "-" + ii + "-rep").value, weight: 0, reps: 0 })
        }
      }
      data.push({ id: this.state.exerciseTemplates[i].exercise_template_id, set_data: set_data, comment: this.state.exerciseTemplates[i].name })
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      token: localStorage.getItem('loginToken'), name: document.getElementById('create-name').value
      , comment: 'Empty', data: data
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/templates/save_workout`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          swal(GetString("alert-workout-saved")[0], `${document.getElementById('create-name').value}` + GetString("alert-workout-saved")[1], "success")
        } else {
          swal(GetString("alert-general-error")[0], GetString("alert-general-error")[1], "error")
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount() {
    this.getSavedTemplates();
  }
  setRepsCount(index, change){
    var i = document.getElementById(`create-reps-${index}`);
    var v = Number(i.value) + Number(change);
    if(v < 0){
      i.value = 0;
    }
    else if(v > 20){
      i.value = 20;
    }else{
      i.value = v;
    }
    this.handleRepsChange(null, index,v)
  }
  render() {
    const exerciseCards = this.state.exerciseTemplates.map((template, index) => (

        <Card key={index} style={{ width: 300, border: 'white'}} className='create-workout-card'>
          <Card.Body>
            {template.name != 'Empty' ? <Card.Title style={{width: "85%", display: "inline-block", marginLeft: 10}}>{template.name}</Card.Title> : <Card.Title><input placeholder='name' /></Card.Title>}
            <Icon_remove style={{ width: 20, height: 20, marginTop: -10}} className='interactable' onClick={() => this.deleteCard(index)} />
            <p style={{display: 'inline-block', margin: 10}} className='interactable' onClick={()=> this.setRepsCount(index,-1)}>-</p>
            <input
              style={{ width: 50, textAlign: 'center' }}
              placeholder='0'
              id={`create-reps-${index}`}
              onChange={(event) => this.handleRepsChange(event, index)}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
            />
            <p style={{display: 'inline-block', margin:5}} className='interactable' onClick={()=> this.setRepsCount(index,1)}>+</p>
            <ol style={{ maxHeight: 200, height: 200, marginTop: 20, overflow: 'auto', width: "100%"}}>
              {Array.from({ length: this.state.exercises[index] }).map((_, liIndex) => (
                <li key={liIndex} style={{ textAlign: 'start', margin: 5 }}>
                  {template.type === 'rep' && <Icon_reps style={{ width: 20, height: 20 }} />}
                  {template.type === 'time' && <Icon_duration style={{ width: 20, height: 20 }} />}
                  <input id={index + '-' + liIndex + '-rep'} style={{ width: 50 }} placeholder={template.type === 'time' && 'sec'} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}/>
                  {template.type === 'rep' && <div style={{ display: 'inline-block' }}><Icon_weight style={{ width: 20, height: 20 }} /> <input id={index + '-' + liIndex + '-weight'} placeholder='kg' style={{ width: 50 }} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}/></div>}
                </li>
              ))}
            </ol>
          </Card.Body>
        </Card>
    ));
    return (
      <div className='page'>
        <div className='load-anim create-container' style={{ position: 'relative', top: -150 }}>
          <div className='create-muscles' style={{ position: 'relative', top: 150 }}>
            <MusclesView ref={this.muscleRef} chooseCallback={this.chooseMuscleGroup} />
          </div>
          <div className='anim create-templates' style={{ color: 'white', position: 'relative', top: -600, left: '20%',height: 500, overflow: 'auto', width: 300 }}>
            <h1 style={{ marginTop: 5, textAlign: 'center' }}>{GetString("create-template")}</h1>
            {this.state.getTemplates.map((template, index) => (
              <div>
                {template.muscles.includes(this.state.choosenGroup) &&
                  <div ref={this.cardRef} draggable
                    onDragStart={(e) => this.dragStart(e, index, template)}
                    onDragEnd={(e) =>this.dragEnd(e)}
                    onDrop={this.drop} onMouseEnter={() => this.colorAffectedMuscles(template.muscles, false)} onMouseLeave={() => this.colorAffectedMuscles(template.muscles, true)} onClick={() => this.selectTemplate(template.name, template.type, template.id)} key={index} className='interactable load-anim exercise-card'>
                    <div className='bottom'>
                      <h2>{template.name}</h2>
                      <p style={{ marginTop: -10, fontSize: 11 }}>({template.muscles.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")})</p>
                    </div>
                  </div>}
              </div>
            ))}
          </div>
          <div onDragOver={this.dragOver}
            onDrop={this.createWorkoutDrop} className='create-drop' style={{ color: 'white', position: 'relative', top: -1100, left: 1050, outline: "#fff"}}>
            <div className={`create-workout anim ${this.state.currentTemplateGrabbed != '' ? 'highlight' : ''}`} ref={this.containerRef} style={exerciseCards.length == 0 ? { position: 'relative', left: 50, height: 200, textAlign: 'center' }
              : { position: 'relative', left: 50, textAlign: 'center' }}>
              <input id='create-name' style={{ display: 'inline-block' }} placeholder='Name'></input>
              <Icon_save className='interactable' title='Save Workout' onClick={() => this.saveWorkout()} />

              {exerciseCards.length == 0 && <h1>{GetString("create-select-a-muscle")}</h1>}
              <div className="card-container">
                {exerciseCards}

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
export default AuthRedirect(CreatePageWrapper);
