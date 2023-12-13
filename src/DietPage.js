import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import { PieChart } from 'react-minimal-pie-chart';
import AuthRedirect from './authRedirect';
import DietChart from './DietChart';
import NavBarWrapper from './NavBar';

class DietPage extends Component {
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
      <div className='page'>
        <div style={{ position: 'relative', left: '39vw', top: 250 }} className='chart'>
          <div style={{position:'relative', left:-500, top: -250}}>
            <DietChart/>
          </div>
        
          <div className='anim add-calorie load-anim'>
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
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(DietPage);