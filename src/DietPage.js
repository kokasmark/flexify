import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { ReactComponent as Icon_add } from './assets/icon-add.svg';
import { ReactComponent as Icon_search } from './assets/icon-search.svg';
import { ReactComponent as Icon_remove } from './assets/icon-remove.svg';
import Sidebar from './Sidebar';
import AuthRedirect from './authRedirect';
import NavBarWrapper from './NavBar';
import { host } from './constants'
import swal from 'sweetalert';
import { CallApi } from './api';
class DietPage extends Component {
  state = {
    carbs: 0,
    fat: 0,
    proteins: 0,
    calories: 3000,
    selectedMeal: null,
    meals: {
      breakfast: {totalCalories: 0, average: 300, icons: ["icon-apple", "icon-croissant", "icon-egg", "icon-sausage"],foods: []},
      lunch:  {totalCalories: 0, average: 300, icons: ["icon-steak", "icon-hamburger", "icon-pizza", "icon-sandwich"],foods: []},
      dinner:  {totalCalories: 0, average: 300, icons: ["icon-steak", "icon-hamburger", "icon-pizza", "icon-sandwich"],foods: []},
      snacks:  {totalCalories: 0, average: 300, icons: ["icon-chips", "icon-cupcake", "icon-popcorn", "icon-apple"],foods: []}
    },
    animation: ''
  }

  addFood = (meal) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Api-Key", "CPyB7czRU+gk5oSYCEuxPA==QmXFanfZcubFgroY")

    var foodName = document.getElementById('food-name').value;
    var foodAmount = document.getElementById('food-amount').value

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      mode: 'no-cors'
    };

    var query = `${foodAmount} ${foodName}`;

    fetch('https://api.api-ninjas.com/v1/nutrition?query=' + query, {
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        var d = data[0];
        console.log(d)
        if(d != undefined){
        this.setState((prevState) => {
          var updatedMeals = { ...prevState.meals };
          updatedMeals[meal].totalCalories = updatedMeals[meal].totalCalories + Math.ceil(d.calories);
          updatedMeals[meal].foods.push({name: foodName, calories:  Math.ceil(d.calories)})
          this.manageParticles(meal, updatedMeals[meal].totalCalories)
          return { meals: updatedMeals };
        });
      }else{
        swal('Oops!', 'Cannont find food or beverage named: '+foodName, "error")
      }
      })
      .catch(error => {
        // Handle errors here
        console.error('Fetch error:', error);
      });



  }
  manageParticles(meal, calories) {
    var average = this.state.meals[meal].average;
    var icons = this.state.meals[meal].icons;
    var numOfParticles = Math.floor((calories / 2000) *20);
    numOfParticles = numOfParticles < 21 ? numOfParticles : 20;
    var parent = document.getElementById("particle-container-"+meal);
    console.log(parent)
    var kcalText = document.getElementById("kcal-"+meal);
    var colors = ["var(--heat-yellow)","var(--heat-orange)","var(--heat-red)"]

    parent.innerHTML = '';
    kcalText.innerHTML = `${calories}kcal`;
    kcalText.style.color = Math.floor((calories / average)) > colors.length ? "var(--heat-red)": colors[Math.floor((calories / average))]
  
    var maxParticlesInTopRow = 6;
    var offsetMultiplier = 35;
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
  
      imageElement.style.rotate = `${(Math.random() - 0.5) * 10}deg`;
      imageElement.style.left = leftPosition;
      imageElement.style.top = topPosition;
      imageElement.style.opacity = '0';

      imageElement.className = "food-particle"
      imageElement.style.animation = `falling 1s ease-out ${Math.random()}s forwards`;
      parent.appendChild(imageElement);
      

      imageElement.addEventListener('animationend', () => {
        imageElement.style.opacity = '1';
    });
      // Adjust maxParticlesInRow for each row
      if (column === maxParticlesInTopRow - 1) {
        maxParticlesInTopRow--;
      }
    }
  }
  removeFood(meal, index){
    this.setState((prevState) => {
      var updatedMeals = { ...prevState.meals };
      updatedMeals[meal].totalCalories -= updatedMeals[meal].foods[index].calories
      updatedMeals[meal].foods.splice(index,1)
      this.manageParticles(meal, updatedMeals[meal].totalCalories)
      return { meals: updatedMeals };
    });
  }
  async closePopUp(){
    this.setState({animation: ' close'})
    await new Promise(res => setTimeout(res, 490))
    this.setState({selectedMeal: null, animation: ''})
  }
  async getDiet(){
    var r = await CallApi("diet",  {token: localStorage.getItem("loginToken"), date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`})
    if(r.success){
      console.log(r.json)
      var meals = r.json;
      var updatedMeals = this.state.meals;
      Object.keys(meals).forEach(meal => {
        var calorie = 0;
        for(var i = 0; i < meals[meal].length; i++){
          calorie += meals[meal][i].calories
          updatedMeals[meal].foods.push({name: meals[meal][i].name, calories:  meals[meal][i].calories})
        }
        updatedMeals[meal].totalCalories = calorie
        this.manageParticles(meal, calorie)
      });
      this.setState({meals: updatedMeals})
    }
  }
  componentDidMount(){
    this.getDiet()
  }
  render() {
    return (
      <div className='page'>
        <div className='plate-container' style={{filter: this.state.selectedMeal != null ? 'blur(3px)' : ''}}>
          <div className='diet-plate interactable' style={{animation: `card-load-${2 % 2 == 0 ? 'up': 'down'} ${2/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'breakfast', icon: require('./assets/foods/icon-croissant.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Breakfast</h1>
            
            <div className='food-particles' id="particle-container-breakfast">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-breakfast">{this.state.meals["breakfast"].totalCalories}kcal</h1>
          </div>
          <div className='diet-plate interactable' style={{animation: `card-load-${3 % 2 == 0 ? 'up': 'down'} ${3/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'lunch', icon: require('./assets/foods/icon-hamburger.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Lunch</h1>
            
            <div className='food-particles' id="particle-container-lunch">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-lunch">{this.state.meals["lunch"].totalCalories}kcal</h1>
          </div>
          <div className='diet-plate interactable' style={{animation: `card-load-${4 % 2 == 0 ? 'up': 'down'} ${4/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'dinner', icon: require('./assets/foods/icon-steak.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Dinner</h1>
            
            <div className='food-particles' id="particle-container-dinner">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-dinner">{this.state.meals["dinner"].totalCalories}kcal</h1>
          </div>
          <div className='diet-plate interactable' style={{animation: `card-load-${5 % 2 == 0 ? 'up': 'down'} ${5/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'snacks', icon: require('./assets/foods/icon-cupcake.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Snacks</h1>
            
            <div className='food-particles' id="particle-container-snacks">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-snacks">{this.state.meals["snacks"].totalCalories}kcal</h1>
          </div>
        </div>

        {this.state.selectedMeal != null && <div className={'diet-add-popup highlight'+this.state.animation}>
          <h2 className='interactable' onClick={()=>this.closePopUp()}>x</h2>
          <img src={this.state.selectedMeal.icon} style={{marginTop: 50}}/>
          <h1>{this.state.selectedMeal.name}</h1>
          <div style={{width: '100%', marginLeft: '7.5%'}}>
            <input style={{width: '60%', marginLeft: '-14%'}} placeholder='What did you eat?' id='food-name'></input>
            <input style={{width: '10%', marginLeft: '1%'}} placeholder='100g' id='food-amount'></input>
          </div>
          <div className='foods-added-container'>
          {this.state.meals[this.state.selectedMeal.name].foods.map((food, index) => (
            <div key={index} className='foods-added'>
              <p style={{ display: 'inline' }}>{food.name} {food.calories}kcal</p>
              <Icon_remove className='interactable remove' onClick={()=> this.removeFood(this.state.selectedMeal.name,index)}/>
            </div>
          ))}
            
          </div>
          <button className='interactable' onClick={()=> this.addFood(this.state.selectedMeal.name)}><Icon_add/> Add to {this.state.selectedMeal.name}</button>
          
        </div>}
        <NavBarWrapper />
        <Sidebar />
      </div>
    );
  }
}
export default AuthRedirect(DietPage);