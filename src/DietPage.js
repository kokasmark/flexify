import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import { PieChart } from 'react-minimal-pie-chart';


export default class DietPage extends Component {
  state = {
    carbs: 0,
    fat: 0,
    proteins: 0,
    calories: 0
  }


  addCaloriesManually = () =>{
    var c = document.getElementById('add-carbs').value == "" ? 0:parseInt(document.getElementById('add-carbs').value);
    var f =document.getElementById('add-fat').value == "" ? 0: parseInt(document.getElementById('add-fat').value);
    var p = document.getElementById('add-proteins').value == "" ? 0:parseInt(document.getElementById('add-proteins').value);
    console.log(c, f, p)
    this.setState({carbs: this.state.carbs + c,fat: this.state.fat + f,proteins: this.state.proteins + p})

    this.setState({calories: ((this.state.carbs+c) * 4)+((this.state.fat+f) * 9)+((this.state.proteins+p) * 4)})
  }

  render() {
    return (
      <div>
        <div style={{ position: 'relative', left: '39vw', top: 250 }} className='chart'>
        {(this.state.carbs > 0 || this.state.fat > 0 || this.state.proteins > 0) ? <div>
            <h1 style={{ margin: 0, position: 'relative', left: 100, top: 220, color: 'white', textAlign: 'center', width: 200 }}>{this.state.calories} kcal</h1>
            <div style={{position: 'absolute', top: -50, left: 400}}>
              <ul style={{color:'white', listStyle: 'none'}}>
                <li style={{marginBottom: -30}}>
                  <div style={{width:30,height:30, borderRadius: 10, backgroundColor: '#1C1533'}}></div>
                  <p style={{position:'relative', top:-28, left: 35}}>Carbs</p>
                </li>
                <li style={{marginBottom: -30}}>
                  <div style={{width:30,height:30, borderRadius: 10, backgroundColor: '#3C6FAA'}}></div>
                  <p style={{position:'relative', top:-28, left: 35}}>Fat</p>
                </li>
                <li>
                  <div style={{width:30,height:30, borderRadius: 10, backgroundColor: '#10D8B8'}}></div>
                  <p style={{position:'relative', top:-28, left: 35}}>Proteins</p>
                </li>
              </ul>
            </div>
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
                    value: this.state.carbs,
                  },
                  {
                    color: "#3C6FAA",
                    title: "Fat",
                    value: this.state.fat,
                  },
                  {
                    color: "#10D8B8",
                    title: "Proteins",
                    value: this.state.proteins,
                  },
                ]}
                labelPosition={110}
                lengthAngle={360}
                lineWidth={50}
                paddingAngle={0}
                radius={50}
                startAngle={0}
                viewBoxSize={[200, 200]}
                style={{ width: 800, height: 800 }}
              />
            </div>
          </div> : <div style={{position: 'relative', top: 200}}><h1 style={{color: 'white'}}>There is no data for today.</h1></div>}
          <div className='anim add-calorie'>
            <h1 style={{color: 'white', fontSize: 25, width:'100%', margin: 0}}>Add Calories Manually</h1>
            <ul style={{listStyle: 'none'}}>
              <li style={{marginBottom: 10, marginLeft: -25, marginTop: 40}}>
                <input placeholder='Carbs' id='add-carbs'></input>
                <p style={{color: 'white', display: 'inline-block', marginLeft: 5}}>g</p>
              </li>
              <li style={{marginBottom: 10, marginLeft: -25}}>
                <input placeholder='Fat' id='add-fat'></input>
                <p style={{color: 'white', display: 'inline-block', marginLeft: 5}}>g</p>
              </li>
              <li style={{marginBottom: 10, marginLeft: -25}}>
                <input placeholder='Proteins' id='add-proteins'></input>
                <p style={{color: 'white', display: 'inline-block', marginLeft: 5}}>g</p>
              </li>
            </ul>
            <Icon_add className='interactable' onClick={this.addCaloriesManually}/>
          </div>
        </div>
        <Navbar />
        <Sidebar />
      </div>
    );
  }
}
