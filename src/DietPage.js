import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import { ReactComponent as Icon_search } from './assets/icon-search.svg';
import Sidebar from './Sidebar';
import Navbar from './NavBar';
import { PieChart } from 'react-minimal-pie-chart';
import AuthRedirect from './authRedirect';
import DietChart from './DietChart';
import NavBarWrapper from './NavBar';
import {host} from './constants'
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

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: localStorage.getItem('loginToken'), carbs: c, fat: f, protein: p, location: "web"});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/diet/add`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if(r.success){
          this.setState({carbs: this.state.carbs + c,fat: this.state.fat + f,proteins: this.state.proteins + p})

          this.setState({calories: ((this.state.carbs+c) * 4)+((this.state.fat+f) * 9)+((this.state.proteins+p) * 4)})
        }else{
          
        }
      })
      .catch(error => console.log('error', error));

   
  }
  searchFood = () =>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Api-Key", "CPyB7czRU+gk5oSYCEuxPA==QmXFanfZcubFgroY")

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      mode: 'no-cors'
    };

    var query = document.getElementById('food-querry').value;

    fetch('https://api.api-ninjas.com/v1/nutrition?query=' + query, {
      method: 'GET',
      headers: {
        'X-Api-Key': 'CPyB7czRU+gk5oSYCEuxPA==QmXFanfZcubFgroY',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        var d = data[0];
        document.getElementById('food-calories').innerHTML = "Calories: "+ d.calories;
        document.getElementById('food-fat').innerHTML = "Fat: "+ d.fat_total_g;
        document.getElementById('food-carbs').innerHTML ="Carbs: "+ d.carbohydrates_total_g;
        document.getElementById('food-protein').innerHTML ="Protein: "+ d.protein_g;
      })
      .catch(error => {
        // Handle errors here
        console.error('Fetch error:', error);
      });
    

   
  }
  addFood(){
    var p = Number(document.getElementById('food-protein').innerHTML.replace("Protein: ",''));
    var c = Number(document.getElementById('food-carbs').innerHTML.replace("Carbs: ",''));
    var f = Number(document.getElementById('food-fat').innerHTML.replace("Fat: ",''));
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({token: localStorage.getItem('loginToken'), carbs: c
    , fat: f, protein: p, location: "web"});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/diet/add`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if(r.success){
          this.setState({carbs: this.state.carbs + c,fat: this.state.fat + f,proteins: this.state.proteins + p})

          this.setState({calories: ((this.state.carbs+c) * 4)+((this.state.fat+f) * 9)+((this.state.proteins+p) * 4)})
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <div className='page'>
        <div style={{ position: 'relative', left: '39vw', top: 250 }} className='chart'>
          <div className='dietpage-chart' style={{position:'relative', left:0, top: 0}}>
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
          <div className='anim add-food load-anim' style={{position: 'absolute', top: 300}}>
            <h1 style={{color: 'white', fontSize: 25, width:'100%', margin: 0}}>Add Food</h1>
            <input id='food-querry' placeholder='Example: 10g Chicken'></input><Icon_search className='interactable' onClick={this.searchFood}/>
            <ul style={{textAlign: 'start', color: 'white'}}>
              <li><p id='food-calories'></p></li>
              <li><p id='food-fat'></p></li>
              <li><p id='food-protein'></p></li>
              <li><p id='food-carbs'></p></li>
            </ul>
            <Icon_add className='interactable' onClick={this.addFood}/>
          </div>
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(DietPage);