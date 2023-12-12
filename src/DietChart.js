import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import { PieChart } from 'react-minimal-pie-chart';

export default class DietChart extends Component {
  state = {
    carbs: 0,
    fat: 0,
    protein: 0,
    calories: 0
  }

  getUserDiet(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: localStorage.getItem('loginToken')});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/diet", requestOptions)
      .then(response => response.text())
      .then((response) => {
        console.log(response)
        var r = JSON.parse(response);
        if(r.success){
          this.setState({carbs: r.carbs, fat: r.fat, protein: r.protein, calories: r.calories});
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount(){
    this.getUserDiet();
  }
  render() {
    return (
      <div>
        <div style={{ position: 'relative', left: '39vw', top: 250 }} className='chart load-anim'>
        {(this.state.carbs > 0 || this.state.fat > 0 || this.state.proteins > 0) ? <div>
            <h1 style={{ margin: 0, position: 'relative', left: 100, top: 220, color: 'white', textAlign: 'center', width: 200 }}>{this.state.calories} kcal</h1>
            {this.props.hideInfo == null &&<div style={{position: 'absolute', top: 300, left: 400}}>
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
            </div>}
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
                    title: "Carbs: "+this.state.carbs+" g",
                    value: this.state.carbs,
                  },
                  {
                    color: "#3C6FAA",
                    title: "Fat: "+this.state.fat+" g",
                    value: this.state.fat,
                  },
                  {
                    color: "#10D8B8",
                    title: "Proteins: "+this.state.protein+" g",
                    value: this.state.protein,
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
                className='anim'
              />
            </div>
          </div> : <div style={{position: 'relative', top: 200, right: 400}}><h1 style={{color: 'white'}}>There is no data for today.</h1></div>}
        </div>
        <Navbar />
        <Sidebar />
      </div>
    );
  }
}