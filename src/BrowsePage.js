import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import MusclesView from './MusclesView';

export default class BrowsePage extends Component {
    state = {
        choosenGroup: ''
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

    render() {
        return (
            <div>
                <div style={{position: 'relative', left: 250}}>
                    <div style={{ position: 'absolute' }}>
                        <MusclesView chooseCallback={this.chooseMuscleGroup} />
                    </div>
                    {this.state.choosenGroup != '' ?<div key={this.state.choosenGroup} className='workouts anim' style={{ position: 'relative', left: 800, top: 250 }}>
                    <h1 style={{marginBottom: 20, color: 'white'}}>{this.state.choosenGroup.charAt(0).toUpperCase() + this.state.choosenGroup.slice(1)}  workouts</h1>
                        <Card  className="animated-card" style={{ width: '15rem', marginTop: 10 }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card  className="animated-card" style={{ width: '15rem', marginTop: 10 }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card  className="animated-card" style={{ width: '15rem', marginTop: 10 }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Button className='anim' style={{backgroundColor: 'var(--contrast)', border: 'none',margin: 30}}>Suggest me Workouts</Button>
                    </div> : <h1  style={{ position: 'relative', left: 700, top: 250, color: 'white' }}>Choose a muscle group that you want to train</h1>}
                </div>

                
                
                <Sidebar />
                <Navbar/>

            </div>
        );
    }
}
