import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_save } from './assets/icon-bookmark.svg';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import MusclesView from './MusclesView';
import AuthRedirect from './authRedirect';

class BrowsePage extends Component {
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
            <div className='page'>
                <div style={{position: 'relative', left: 250}}>
                    <div style={{ position: 'absolute' }}>
                        <MusclesView chooseCallback={this.chooseMuscleGroup} />
                    </div>
                    {this.state.choosenGroup != '' ?<div key={this.state.choosenGroup} className='workouts anim' style={{ position: 'relative', left: 800, top: 175 }}>
                    <h1 style={{marginBottom: 20, color: 'white'}}>{this.state.choosenGroup.charAt(0).toUpperCase() + this.state.choosenGroup.slice(1)}  workouts</h1>
                        <Card  className="animated-card" style={{ maxWidth: 240, marginTop: -20 }}>
                        <Icon_save className='interactable' style={{position: 'relative', height: 30, width:30, top: 35, left: '85%'}}/>
                            <Card.Body>
                                <Card.Title>{this.state.choosenGroup} workout</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card  className="animated-card" style={{ maxWidth: 240, marginTop: -20 }}>
                        <Icon_save className='interactable' style={{position: 'relative', height: 30, width:30, top: 35, left: '85%'}}/>
                            <Card.Body>
                                <Card.Title>{this.state.choosenGroup} workout</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card  className="animated-card" style={{ maxWidth: 240, marginTop: -20 }}>
                        <Icon_save className='interactable' style={{position: 'relative', height: 30, width:30, top: 35, left: '85%'}}/>
                            <Card.Body>
                                <Card.Title>{this.state.choosenGroup} workout</Card.Title>                            <Card.Text>
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
export default AuthRedirect(BrowsePage);