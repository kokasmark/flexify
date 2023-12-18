import logo from './logo.svg';
import './App.css';
import React,{ Component } from 'react';
import { ReactComponent as Icon_save } from './assets/icon-bookmark.svg';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import MusclesView from './MusclesView';
import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';
import {host} from './constants'
import GetString from './language';

class BrowsePage extends Component {
  muscleRef = React.createRef();
    state = {
        choosenGroup: '',
        templates: []
    }
    chooseMuscleGroup = (g) => {
        if (g != null && g.name != '') {
          console.log(JSON.parse(this.state.templates[0].muscles), g.name)
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
  
      fetch(`http://${host}:3001/api/templates/exercises`, requestOptions)
        .then(response => response.text())
        .then((response) => {
          console.log(response)
          var r = JSON.parse(response);
          if (r.success) {
            this.setState({ templates: r.data });
          } else {
  
          }
        })
        .catch(error => console.log('error', error));
      }
      componentDidMount(){
        this.getExerciseTemplates();
      }
      colorAffectedMuscles(muscles, leave){
        var affected = JSON.parse(muscles);
  
        for (const groupName in this.muscleRef.current.getGroup()) {
          this.muscleRef.current.updateMuscleGroup(groupName,0);
        }
        this.muscleRef.current.updateMuscleGroup(this.state.choosenGroup,2);
        if(!leave){
        for(var i = 0; i < affected.length; i++){
          if(affected[i] != this.state.choosenGroup){
          this.muscleRef.current.updateMuscleGroup(affected[i],1);
          }
        }
        
      }
    }
    render() {
        return (
            <div className='page'>
                <div style={{position: 'relative', left: 250}} className='load-anim'>
                    <div style={{ position: 'absolute' }}>
                        <MusclesView ref={this.muscleRef}chooseCallback={this.chooseMuscleGroup} />
                    </div>
                    {this.state.choosenGroup != '' ?<div key={this.state.choosenGroup} className='workouts anim' style={{ position: 'relative', left: 800, top: 175 }}>
                    <h1 style={{marginBottom: 20, color: 'white'}}>{this.state.choosenGroup.charAt(0).toUpperCase() + this.state.choosenGroup.slice(1)}  {GetString("workouts")}</h1>
                    {this.state.templates.map((template, index) => (
                      <div>
                    {JSON.parse(template.muscles).includes(this.state.choosenGroup) &&
                    <Card key={index}
                    onMouseEnter={()=>this.colorAffectedMuscles(template.muscles, false)} 
                    onMouseLeave={()=>this.colorAffectedMuscles(template.muscles, true)}
                    className="animated-card interactable" style={{ maxWidth: 240, marginTop: -20 }}>
                    <Icon_save className='interactable' style={{position: 'relative', height: 30, width:30, top: 35, left: '85%'}}/>
                        <Card.Body>
                            <Card.Title>{template.name}</Card.Title>                            
                            <Card.Text>
                                This workout will work on your:
                                <ul>
                                {JSON.parse(template.muscles).map((muscle, index) => (
                                  <li>{muscle}</li>
                                ))}
                                </ul>
                            </Card.Text>
                        </Card.Body>
                    </Card>}</div>
                  ))}
                        
                        <Button className='anim' style={{backgroundColor: 'var(--contrast)', border: 'none',margin: 30}}>{GetString("browse-suggest")}</Button>
                    </div> : <h1  style={{ position: 'relative', left: 700, top: 250, color: 'white', width: 1000 }}>{GetString("browse-choose-a-muscle")}</h1>}
                </div>

                
                
                <Sidebar />
                <NavBarWrapper />

            </div>
        );
    }
}
export default AuthRedirect(BrowsePage);