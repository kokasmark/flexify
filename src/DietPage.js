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
import { host } from './constants'
import { kMaxLength } from 'buffer';
class DietPage extends Component {
  state = {
    carbs: 0,
    fat: 0,
    proteins: 0,
    calories: 3000
  }


  addCaloriesManually = () => {
    var c = document.getElementById('add-carbs').value == "" ? 0 : parseInt(document.getElementById('add-carbs').value);
    var f = document.getElementById('add-fat').value == "" ? 0 : parseInt(document.getElementById('add-fat').value);
    var p = document.getElementById('add-proteins').value == "" ? 0 : parseInt(document.getElementById('add-proteins').value);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ token: localStorage.getItem('loginToken'), carbs: c, fat: f, protein: p, location: "web" });

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
        if (r.success) {
          this.setState({ carbs: this.state.carbs + c, fat: this.state.fat + f, proteins: this.state.proteins + p })

          this.setState({ calories: ((this.state.carbs + c) * 4) + ((this.state.fat + f) * 9) + ((this.state.proteins + p) * 4) })
        } else {

        }
      })
      .catch(error => console.log('error', error));


  }
  searchFood = () => {
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
        document.getElementById('food-calories').innerHTML = "Calories: " + d.calories;
        document.getElementById('food-fat').innerHTML = "Fat: " + d.fat_total_g;
        document.getElementById('food-carbs').innerHTML = "Carbs: " + d.carbohydrates_total_g;
        document.getElementById('food-protein').innerHTML = "Protein: " + d.protein_g;
      })
      .catch(error => {
        // Handle errors here
        console.error('Fetch error:', error);
      });



  }
  addFood() {
    var p = Number(document.getElementById('food-protein').innerHTML.replace("Protein: ", ''));
    var c = Number(document.getElementById('food-carbs').innerHTML.replace("Carbs: ", ''));
    var f = Number(document.getElementById('food-fat').innerHTML.replace("Fat: ", ''));

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      token: localStorage.getItem('loginToken'), carbs: c
      , fat: f, protein: p, location: "web"
    });

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
        if (r.success) {
          this.setState({ carbs: this.state.carbs + c, fat: this.state.fat + f, proteins: this.state.proteins + p })

          this.setState({ calories: ((this.state.carbs + c) * 4) + ((this.state.fat + f) * 9) + ((this.state.proteins + p) * 4) })
        } else {

        }
      })
      .catch(error => console.log('error', error));
  }
  manageParticles(calories,index, average, icons) {
    var numOfParticles = Math.floor((calories / 2000) *20);
    var parent = document.getElementById("particle-container-"+index);
    var kcalText = document.getElementById("kcal-"+index);
    var colors = ["var(--heat-yellow)","var(--heat-orange)","var(--heat-red)"]

    kcalText.innerHTML = `${calories}kcal`;
    kcalText.style.color = Math.floor((calories / average)) > colors.length ? "var(--heat-red)": colors[Math.floor((calories / average))]
  
    var maxParticlesInTopRow = 6;
    var offsetMultiplier = 30;
    var constantOffset = 40; // Adjust this value based on your requirements
    var verticalOffset = Math.max(0, (numOfParticles - 6) * 10);
  
    for (var i = 0; i < numOfParticles; i++) {
      const food_icon = icons[Math.floor(Math.random() * icons.length)];
  
      // Create a new image element
      const imageElement = document.createElement("img");
  
      // Set the source dynamically
      imageElement.src = require(`./assets/foods/${food_icon}.png`);
  
      // Set style
      imageElement.style.position = 'relative';
  
      // Calculate row and column for the pyramid effect
      const row = Math.floor((-1 + Math.sqrt(1 + 8 * i)) / 2);
      const column = i - row * (row + 1) / 2;
  
      // Calculate left offset for centering the row
      const leftOffset = (maxParticlesInTopRow - row) * 0.5 * offsetMultiplier + constantOffset;
  
      // Set position based on row and column
      const leftPosition = `${column * offsetMultiplier + leftOffset}px`;
      const topPosition = `${row * offsetMultiplier - verticalOffset}px`;
  
      imageElement.style.rotate = `${(Math.random() - 0.5) * 30}deg`;
      imageElement.style.left = leftPosition;
      imageElement.style.top = topPosition;

      imageElement.className = "food-particle"
  
      parent.appendChild(imageElement);
  
      // Adjust maxParticlesInRow for each row
      if (column === maxParticlesInTopRow - 1) {
        maxParticlesInTopRow--;
      }
    }
  }
  
  
  
  
  componentDidMount() {
    this.manageParticles(Math.floor(Math.random()*2000),0,400*2,["icon-apple", "icon-croissant", "icon-egg", "icon-sausage"])
    this.manageParticles(Math.floor(Math.random()*2000),1,600*2,["icon-steak", "icon-hamburger", "icon-pizza", "icon-sandwich"])
    this.manageParticles(Math.floor(Math.random()*2000),2,600*2,["icon-apple", "icon-croissant", "icon-egg", "icon-sausage"])
    this.manageParticles(Math.floor(Math.random()*2000),3,150*2,["icon-apple", "icon-croissant", "icon-egg", "icon-sausage"])
  }
  render() {
    return (
      <div className='page'>
        <div className='plate-container'>
          <div className='diet-plate interactable'>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Breakfast</h1>
            
            <div className='food-particles' id="particle-container-0">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-0">0000kcal</h1>
          </div>
          <div className='diet-plate interactable'>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Lunch</h1>
            
            <div className='food-particles' id="particle-container-1">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-1">0000kcal</h1>
          </div>
          <div className='diet-plate interactable'>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Dinner</h1>
            
            <div className='food-particles' id="particle-container-2">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-2">0000kcal</h1>
          </div>
          <div className='diet-plate interactable'>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Snacks</h1>
            
            <div className='food-particles' id="particle-container-3">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-3">0000kcal</h1>
          </div>
        </div>
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(DietPage);