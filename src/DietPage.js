import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import { PieChart } from 'react-minimal-pie-chart';


export default class DietPage extends Component {
  render() {
    return (
      <div>
        <div style={{position: 'relative', left: '39vw', top: 250}} className='chart'>
          <h1 style={{margin: 0, position: 'relative', left: 100, top: 220, color: 'white', textAlign: 'center', width: 200}}>2000 kcal</h1>
          <div  style={{position: 'relative', left: -200, top: -200}}>
          <PieChart
            label={(props) => { return props.dataEntry.title;}}
            animate='true'
            animationDuration={1000}
            animationEasing="ease"
            center={[100, 100]}
            data={[
              {
                color: "#1C1533",
                title: "Carbs",
                value: 10,
              },
              {
                color: "#3C6FAA",
                title: "Fat",
                value: 15,
              },
              {
                color: "#10D8B8",
                title: "Protein",
                value: 10,
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
        </div>
        <Navbar />
        <Sidebar />
      </div>
    );
  }
}
