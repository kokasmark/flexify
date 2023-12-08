import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { Card } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Navbar from './NavBar';

export default class BrowsePage extends Component {


    render() {
        return (
            <div>
                <div style={{position: 'relative', left: 250}}>
                    <div className='muscles' style={{ position: 'absolute' }}>
                        <Muscles />
                    </div>
                    <div className='workouts' style={{ position: 'relative', left: 800, top: 250 }}>
                        <Card style={{ width: '15rem' }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '15rem', marginTop: 10 }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '15rem', marginTop: 10 }}>
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>                            <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                
                
                <Sidebar />
                <Navbar/>

            </div>
        );
    }
}