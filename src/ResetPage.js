import logo from "./logo.svg";
import "./App.css";
import { Component } from "react";
import { ReactComponent as Icon_user } from "./assets/icon-user.svg";
import { ReactComponent as Icon_email } from "./assets/icon-email.svg";
import { ReactComponent as Icon_password } from "./assets/icon-key.svg";
import Sidebar from "./Sidebar";


import NavBarWrapper from "./NavBar";
import { host } from "./constants";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const ResetPageWrapper = () => {
  const navigate = useNavigate();

  return <ResetPage navigate={navigate} />;
};

class ResetPage extends Component {
  state = {
    stageOfRecovery: 0,
    tokenExpiration: 0,
    remainingTime: this.remainingTime
  };
  nextStage() {
    const stage = this.state.stageOfRecovery + 1

    if (stage == 1) {
      //Check email or username
      this.generateToken();
    }
    if (stage == 2) {
      //Check token
      this.validateToken()
    }
    if (stage == 3) {
      //Set password
      this.resetPassword()
      
    }
  }

  componentDidMount() {
    // Update remaining time every second
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  tick() {
    this.setState({
      remainingTime: this.calculateRemainingTime
    });
  }
  componentWillUnmount() {
    // Clear the interval when the component unmounts
    clearInterval(this.timerID);
  }
  async timer() {
    if (this.state.seconds > 0) {
      this.setState({ seconds: this.state.seconds - 1 })
      await new Promise((r) =>
        setTimeout(r, 1000)
      );
      this.timer()
    }
  }
  remainingTime() {
    const remainingTime = new Date(this.state.tokenExpiration - new Date());
    const minutes = remainingTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = remainingTime.getUTCSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`
  }
  generateToken(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({user: document.getElementById("user").value});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`http://${host}:3001/api/reset/generate`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ stageOfRecovery: this.state.stageOfRecovery + 1, tokenExpiration: new Date(Date.now() + 600000) });
        } else {
          swal("Oops!", "User cannot be found!","error")
        }
      })
      .catch(error => console.log('error', error));
  }
  validateToken(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: document.getElementById("token").value});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`http://${host}:3001/api/reset/validate`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          this.setState({ stageOfRecovery: this.state.stageOfRecovery + 1, token: document.getElementById("token").value});
        } else {
          swal("Oops!", "Token doesnt match!","error")
        }
      })
      .catch(error => console.log('error', error));
  }
  resetPassword(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: this.state.token, password: document.getElementById("password").value});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`http://${host}:3001/api/reset/`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if (r.success) {
          swal("Success!", "Your new password is set!","success")
          const { navigate } = this.props;
          navigate("/login");
        } else {
          swal("Oops!", "Token doesnt match!","error")
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <div className="page">
        <div className="reset-panel">
          <h1 style={{marginTop: "20%"}}>{["Forgot Password?","Check your emails!","New Password"][this.state.stageOfRecovery]}</h1>
          {this.state.stageOfRecovery == 0 && <div className="reset-panel-body">
          <p style={{width:"60%", marginLeft: "20%", marginTop: "-20%", marginBottom: 50}}>It happens, nothing to worry about, please enter your username or email of the account you trying to recover!</p>
            <div style={{ display: "flex", height: 30, marginLeft: "10%" }} >
              <div style={{ display: "flex", marginTop: 0 }}>
                <Icon_user style={{ height: 30 }} />
                <p style={{ marginLeft: -10, marginRight: -10 }}>/</p>
                <Icon_email style={{ height: 30 }} />
              </div>
              <input id="user" style={{ width: "60%" }} placeholder="Email or Username" className="highlight"></input>
            </div>
            <Button className="btn" onClick={() => this.nextStage()}>Send Recovery Email</Button>
          </div>}
          {this.state.stageOfRecovery == 1 && <div className="reset-panel-body">
          <p style={{width:"60%", marginLeft: "20%", marginTop: "-20%", marginBottom: 50}}>We have sent an email to you containing a token that you have to copy! It is advised to check the Spam folder too!</p>
            <h1 className="timer">{this.remainingTime()}</h1>
            <div style={{ display: "flex", height: 30 }}>
              <input id="token" style={{ marginLeft: "10%" }} placeholder="Token" className="highlight"></input>
            </div>
            <Button className="btn" onClick={() => this.nextStage()}>Check Token</Button>
          </div>}
          {this.state.stageOfRecovery == 2 && <div className="reset-panel-body">
          <p style={{width:"60%", marginLeft: "20%", marginTop: "-20%", marginBottom: 50}}>Try coming up with a password that you can easily remember! A strong password should contain Capital letters, Numbers, Special characters!</p>
            <div style={{ display: "flex", height: 30, marginLeft: "10%" }}>
              <Icon_password style={{ height: 40, marginTop: -5 }}/>
              <input id="password" style={{ marginLeft: "0" }} placeholder="New Password" className="highlight"></input>
            </div>
            <Button className="btn" onClick={() => this.nextStage()}>Reset Password</Button>
          </div>}
        </div>
      </div>
    );
  }
}
export default ResetPageWrapper;
