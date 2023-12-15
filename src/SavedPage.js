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

class SavedPage extends Component {
  state = {
    savedTemplates: []
  }
  getSavedTemplates() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken') });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/templates/workouts", requestOptions)
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

        {this.state.savedTemplates.map((template, index) => (
          <Card key={index} style={{ width: 200, height: 250, textAlign: 'center' }}>

            <Card.Body>
              <Card.Title>{template.name}</Card.Title>
              <Card.Text>{template.comment}</Card.Text>
              <ol style={{overflow: 'auto', maxHeight: 250}}>
                {template.data.map((data, index) => (

                  <div>
                    <p>{data.exercise_name}</p>{/*TODO: Name not showing */}
                    {JSON.parse(data.set_data).map((set, index) => (

                      <li style={{textAlign: 'start'}}>
                        <div style={{display: 'inline-block'}}>
                        <Icon_reps  style={{ width: 20, height: 20 }}/><p style={{display: 'inline-block'}}>{set.reps == 0 ? '-': set.reps}</p>
                        <Icon_weight style={{ width: 20, height: 20 }}/><p style={{display: 'inline-block'}}>{set.weight == 0 ? '-': set.weight+' kg'} </p>
                        <Icon_duration style={{ width: 20, height: 20 }}/><p style={{display: 'inline-block'}}>{set.time == 0 ? '-': set.time+' sec'}</p>
                        </div>
                      </li>

                    ))}
                  </div>

                ))}
              </ol>
            </Card.Body>
          </Card>

        ))}
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(SavedPage);
