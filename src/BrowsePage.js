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
        choosenGroup: null,
        templates: [],
        viewedGif: '',
        nameOfGroup: ''
    }
    chooseMuscleGroup = (g) => {
        if (g != null && g.name != '') {
          try { 
            var n = GetString('muscle-'+g.name);
            console.log(n)
            var name = n.charAt(0).toUpperCase() + n.slice(1)
            this.setState({ choosenGroup: g.name,nameOfGroup: name }) 

          } catch { }
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
              <div className='browse-page-header'>
                <h1>Browse Exercises</h1>
                <h3>Click on a muscle to list the exercises that work on it</h3>
              </div>
                    <div className='browse-muscle' style={{ position: 'absolute',left: this.state.choosenGroup == null ? "24%" : "0%" }}>
                        <MusclesView ref={this.muscleRef}chooseCallback={this.chooseMuscleGroup} />
                    </div>
                    {this.state.choosenGroup != null && (
  <div key={this.state.choosenGroup} className='browse-cards'>
    {this.state.templates.map((template, index) => (
      JSON.parse(template.muscles).includes(this.state.choosenGroup) && (
        <Card
          key={Math.random()}
          onMouseEnter={() => this.colorAffectedMuscles(template.muscles, false)}
          onMouseLeave={() => this.colorAffectedMuscles(template.muscles, true)}
          className="animated-card browse-card interactable"
          style={{ animation: `card-load ${0.5 + index / 10}s ease-out`, backgroundColor: "transparent" }}
        >
          <Card.Body>
            <div className='bottom'>
              <Card.Title>{template.name}</Card.Title>
              <img style={{mixBlendMode: "multiply" }} src={require("./assets/exercises/" + template.gifUrl + ".gif")} />
            </div>
          </Card.Body>
        </Card>
      )
    ))}
  </div>
)}



                
                
                <Sidebar />
                <NavBarWrapper />

            </div>
        );
    }
}
export default AuthRedirect(BrowsePage);