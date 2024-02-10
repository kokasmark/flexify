import './App.css';
import React,{ Component } from 'react';
import logo from './assets/logo.webp';
import { ReactComponent as Icon_user } from './assets/icon-user.svg';
import { ReactComponent as Icon_key } from './assets/icon-key.svg';
import { ReactComponent as Icon_view } from './assets/icon-view.svg';
import { ReactComponent as Icon_hide } from './assets/icon-view-hide.svg';
import { ReactComponent as Icon_email } from './assets/icon-email.svg';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {host} from './constants';
import { TypeAnimation } from "react-type-animation";
import Card from "react-bootstrap/Card";
const SignUpWrapper = () => {
  const navigate = useNavigate();

  return <SignUpPage navigate={navigate} />;
};
class SignUpPage extends Component {
  card_manage = React.createRef();
  card_create = React.createRef();
  card_monitor = React.createRef();
  typing = React.createRef();
  state = {
    hidePassword: true,
    cardIndex: 1
  }
  validate = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "username": document.getElementById('username').value, "email": document.getElementById('email').value,
    "password": document.getElementById('password').value, location: "web" });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/signup`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if(r.success){
          console.log('Validating');
          localStorage.setItem('loginToken', r.token);
          const { navigate } = this.props;
          navigate('/');
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
    
  }
  moveCard() {
    const cards = [this.card_manage, this.card_create, this.card_monitor];
    const colors = ["var(--contrast)","var(--heat-orange)","var(--heat-red)"]
    const strings = ["Manage", "Create", "Track"];
    this.typing.current.style.color = colors[this.state.cardIndex]
    try {
      cards[this.state.cardIndex].current.style.transform = "translateY(-100px)";
      cards[this.state.cardIndex - 1].current.style.transform = "translateY(0px)";
      
    } catch {}
    if (this.state.cardIndex < 2) {
      this.setState({ cardIndex: this.state.cardIndex + 1 });
    } else {
      this.setState({ cardIndex: 0 });
    }
    if (this.state.cardIndex == 0) {
      cards[2].current.style.transform = "translateY(0px)";
    }
  }
  componentDidMount() {
    this.pollForChanges();
  }
  componentWillUnmount() {
    // Stop polling when component unmounts
    clearInterval(this.pollInterval);
  }

  pollForChanges = () => {
    // Polling interval
    this.pollInterval = setInterval(() => {
      const spanContent = document.querySelector('.index-module_type__E-SaG').textContent;
      // Check if content has changed
      if (spanContent !== this.lastContent) {
        this.handleContentChange(spanContent);
        this.lastContent = spanContent;
      }
    }, 10); // Adjust polling interval as needed
  };

  handleContentChange = (newContent) => {
    const strings = ["Manage", "Create", "Track"]
    if(newContent.length < 1){
      this.moveCard()
    }
  };
  render() {
    return (
      <div className="page">
        <div
          className="sign-in-panel"
          style={{
            width: 600,
            height: "100%",
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
            borderRadius: 0,
            backgroundColor: "var(--contrast)"
          }}
        >
          <div className="sign-in-controls">
          <img src={logo} style={{marginTop: -100 }} />
          <br/>
          <Icon_email
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              position: "relative",
              left: 5,
            }}/>
          <input id="email" placeholder="Email"></input>
          <br/>
          <Icon_user
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              position: "relative",
              left: 5,
            }}/>
          <input id="username" placeholder="Username"></input>
          <br />
          <Icon_key
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
              position: "relative",
              left: 5,
            }}
          />
          <input
            id="password"
            placeholder="Password"
            type={this.state.hidePassword == true ? "password" : "text"}
          ></input>
          <div
            style={{
              width: 20,
              height: 20,
              position: "relative",
              top: -35,
              left: 440,
            }}
            className="interactable"
            onClick={() =>
              this.setState({ hidePassword: !this.state.hidePassword })
            }
          >
            {this.state.hidePassword == false ? (
              <Icon_view style={{ width: 30, height: 30}} />
            ) : (
              <Icon_hide style={{ width: 30, height: 30 }} />
            )}
          </div>
          <Button
            style={{ width: "50%", marginLeft: "8%", backgroundColor: "var(--heat-orange)" }}
            onClick={this.validate}
          >
            Sign In
          </Button>
          <Link
            className="interactable"
            to="/login"
            style={{
              display: "block",
              width: "80%",
              marginLeft: "13%",
              marginTop: 20,
              color: "white"
            }}
          >
            Already have an account?
          </Link>
          </div>
        </div>
        <div style={{position: "absolute",
              left: "5%",
              top: "25%"}}>
        <div style={{ display: "flex", marginBottom: 100}}>
          <h1
            style={{
              fontSize: "5em",
              color: "white",
              fontWeight: "500"
            }}
          >
            With Flexify you can
          </h1>
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Manage",
              2000, // wait 1s before replacing "Mice" with "Hamsters"
              "Create",
              2000,
              "Track",
              2000,
            ]}
            wrapper="span"
            speed={50}
            deletionSpeed={50}
            className="type-animation"
            repeat={Infinity}
            ref={this.typing}
          />
        </div>
        <div className="signIn-cards">
          <Card style={{ width: "18rem" }} >
            <Card.Body style={{backgroundColor: "var(--contrast)"}}ref={this.card_manage}>
              <Card.Text >
                Take control of your gym life effortlessly with Flexify.
                Seamlessly organize workouts, track progress, and schedule
                sessions with ease. Streamline your fitness journey and unlock
                your full potential with intuitive management tools.
              </Card.Text>
            </Card.Body>
            <img src={require("./assets/icon-progress.png")} style={{width: 80, height: 80, left: 100}}/>
          </Card>
          <Card style={{ width: "18rem" }}>
            <Card.Body style={{backgroundColor: "var(--heat-orange)"}}  ref={this.card_create}>
              <Card.Text>
                Craft personalized workouts tailored to your goals and
                preferences. With Flexify, design routines that suit your needs,
                whether you're aiming for strength, endurance, or flexibility.
                Empower yourself to achieve greatness with custom fitness plans
                built just for you.
              </Card.Text>
            </Card.Body>
            <img src={require("./assets/icon-workout.png")}/>
          </Card>
          <Card style={{ width: "18rem" }} >
            <Card.Body style={{backgroundColor: "var(--heat-red)"}} ref={this.card_monitor}>
              <Card.Text>
                Stay on top of your diet and progress effortlessly with Flexify.
                Monitor nutritional intake, track calorie consumption, and
                analyze fitness data to optimize your health journey. With
                real-time insights and comprehensive tracking, achieve your
                fitness goals faster and more effectively.
              </Card.Text>
            </Card.Body>
            <img src={require("./assets/foods/icon-sandwich.png")}/>
          </Card>
          
        </div>
        </div>
      </div>
    );
  }
}
export default SignUpWrapper;