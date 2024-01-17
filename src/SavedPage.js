import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

import Sidebar from './Sidebar';


import 'react-calendar/dist/Calendar.css';


import AuthRedirect from './authRedirect';
import { Card } from 'react-bootstrap';
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
    opened: -1
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
        console.log(response)
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ savedTemplates: r.templates })
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount() {
    this.getSavedTemplates();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.savedTemplates !== this.state.savedTemplates) {
      console.log(this.state.savedTemplates)
    }
  }
  render() {
    return (
      <div className='page'>

        <div className='saved-card-container load-anim' style={{position: 'absolute', top: 100, marginLeft: 150, borderRadius: 10, 
        height: 800, padding: 20, overflowY: 'auto', backgroundColor: 'var(--darker-contrast)'}}>
        {this.state.savedTemplates.map((template, index) => (
          <Card key={index} style={{ width: 300, height: 350, textAlign: 'center', boxShadow: '5px 5px 10px var(--shadow)' }}>

            <Card.Body>
              <Card.Title>{template.name}</Card.Title>
              <Link to={{ pathname: '/create', search: template.name }} style={{position: 'relative', top: -50, left: 120}}><Icon_copy title='Duplicate Workout' className='interactable'/></Link>
              <div style={{position: 'relative', top: -40}}>
              <Card.Text >{template.comment}</Card.Text>
              <ol style={{maxHeight: 180, overflowY: 'scroll', overflowX: 'hidden'}}>
                {template.data.map((data, olIndex) => (

                  <div className='interactable' key={index} onClick={()=> this.setState({opened: this.state.opened == index+'-'+olIndex? -1:index+'-'+olIndex})}>
                    <h5 style={{textAlign: 'start'}}>{(olIndex+1)+'. '+data.comment}</h5>
                    <div style={{textAlign: 'start',overflow: 'auto', maxHeight: 150, backgroundColor: 'var(--darker-contrast)', borderRadius: 5}}>
                    
                    
                    {JSON.parse(data.set_data).map((set, liIndex) => (
                      <div>
                      {this.state.opened == (index+'-'+olIndex)&& <li key={liIndex}>
                        <div style={{display: 'inline-block'}}>
                        <Icon_reps  style={{ width: 20, height: 20 }}/><p style={{display: 'inline-block', fontWeight: 700}}>{set.reps == 0 ? '-': set.reps}</p>
                        <Icon_weight style={{ width: 20, height: 20 }}/><p style={{display: 'inline-block', fontWeight: 700}}>{set.weight == 0 ? '-': set.weight+' kg'} </p>
                        <Icon_duration style={{ width: 20, height: 20 }}/><p style={{display: 'inline-block', fontWeight: 700}}>{set.time == 0 ? '-': set.time+' sec'}</p>
                        </div>
                      </li>}
                      </div>

                    ))}
                    </div>
                  </div>

                ))}
              </ol>
              </div>
            </Card.Body>
          </Card>

        ))}
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(SavedPage);
