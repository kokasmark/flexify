import './App.css';
import React, { Component } from 'react';
import MusclesView from './MusclesView';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import Calendar from 'react-calendar';
import { PieChart } from 'react-minimal-pie-chart';
import AuthRedirect from './authRedirect';

class App extends Component {
  muscleViewRef = React.createRef();

  state = {
    muscles: []
  }

  colorMuscles(muscles){
    for(var i = 0; i < muscles.length; i++){
      var muscle = muscles[i];
      var name = JSON.parse(muscle).muscle;
      this.muscleViewRef.current.updateMuscleGroup(name, 1);
    }
  }

  getMusclesTrained(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: localStorage.getItem('loginToken')});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/home/muscles", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if(r.success){
          this.setState({muscles: r.muscles});
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
componentDidMount(){
  this.getMusclesTrained();
}
  render() {
    this.colorMuscles(this.state.muscles);
    return (
      <div>
        <div style={{position: 'relative'}}>
        <div className='timePeriod'>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 25px", fontWeight: 'bold'}}>Weekly</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>Monthly</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>6 Months</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 45px 4px 4px"}}>1 Year</p>
          <p className='interactable' style={{display: 'inline-block',color: 'white',margin: "4px 25px 4px 4px"}}>All</p>
        </div>
        <div style={{position: 'absolute', left: 200, top: 400}}>
          <Calendar/>
        </div>
        <MusclesView ref={this.muscleViewRef} muscles={this.state.muscles}/>
        <div style={{position: 'absolute', right: -200, top: 300}} className='home-chart'>
            <h1 style={{ margin: 0, position: 'relative',left: 100, top: 220, color: 'white', textAlign: 'center', width: 200 }}>200 kcal</h1>
            <div style={{ position: 'relative', left: -200, top: -200 }}>
             <PieChart
                label={(props) => { return props.dataEntry.title; }}
                animate='true'
                animationDuration={1000}
                animationEasing="ease"
                center={[100, 100]}
                data={[
                  {
                    color: "#1C1533",
                    title: "Carbs",
                    value: 20,
                  },
                  {
                    color: "#3C6FAA",
                    title: "Fat",
                    value: 10,
                  },
                  {
                    color: "#10D8B8",
                    title: "Proteins",
                    value: 10,
                  },
                ]}
                labelPosition={100}
                lengthAngle={360}
                lineWidth={50}
                paddingAngle={0}
                radius={50}
                startAngle={0}
                viewBoxSize={[200, 200]}
                style={{ width: 800, height: 800 }}
              />
            </div>
          </div> 
        </div>
        <Navbar />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(App);
