import './App.css';
import React, { Component } from 'react';
import { TypeAnimation } from 'react-type-animation';
class DownloadPanel extends Component {
  
  render() {
    return (
      <div className='download-panel'>
        <div className='title'>
          <h1>Designed for </h1>
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Efficiency",
              2000, // wait 1s before replacing "Mice" with "Hamsters"
              "Simplicity",
              2000,
              "Accessibility",
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
        <img className='screenshot' src={require("./assets/phone_screenshot.jpg")}/>
        <img className='screenshot' src={require("./assets/download.png")}/>
      </div>
    );
  }
}
export default DownloadPanel;
