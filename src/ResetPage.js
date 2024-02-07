import logo from "./logo.svg";
import "./App.css";
import { Component } from "react";
import { ReactComponent as Icon_user } from "./assets/icon-user.svg";
import { ReactComponent as Icon_email } from "./assets/icon-email.svg";
import Sidebar from "./Sidebar";


import NavBarWrapper from "./NavBar";
import { host } from "./constants";
import { Button } from "react-bootstrap";

class ResetPage extends Component {
  state = {
    stageOfRecovery: 0,
    seconds: 600
  };
  nextStage(){
    const stage = this.state.stageOfRecovery + 1
    this.setState({stageOfRecovery: stage});
    if(stage == 1){
      this.timer()
    }
  }
  async timer(){
    if(this.state.seconds > 0){
      this.setState({seconds: this.state.seconds-1})
      await new Promise((r) =>
      setTimeout(r, 1000)
    );
    this.timer()
    }
  }
  render() {
    return (
      <div className="page">
        <div className="reset-panel">
          <h1>Forgot Password?</h1>
          {this.state.stageOfRecovery == 0 &&<div className="reset-panel-body">
            <div style={{ display: "flex", height: 30 }}>
              <div style={{ display: "flex", marginTop: 0}}>
                <Icon_user style={{height: 30}}/>
                <p style={{marginLeft: -10, marginRight: -10}}>/</p>
                <Icon_email style={{height: 30}}/>
              </div>
              <input placeholder="Email or Username"></input>
            </div>
            <Button className="btn">Send Recovery Email</Button>
          </div>}
          {this.state.stageOfRecovery == 1 &&<div className="reset-panel-body">
            <h1 className="timer">{new Date((this.state.seconds) * 1000).toISOString().slice(14, 19)}</h1>
            <div style={{ display: "flex", height: 30 }}>
              <input style={{marginLeft: "10%"}} placeholder="Token"></input>
            </div>
            <Button className="btn" onClick={this.nextStage()}>Send Recovery Email</Button>
          </div>}
        </div>
      </div>
    );
  }
}
export default ResetPage;
