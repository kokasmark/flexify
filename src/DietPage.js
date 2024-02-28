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
class DietPage extends Component {
  state = {
    carbs: 0,
    fat: 0,
    proteins: 0,
    calories: 3000,
    selectedMeal: null,
    meals: {
      Breakfast: {totalCalories: 0, average: 300, icons: ["icon-apple", "icon-croissant", "icon-egg", "icon-sausage"],foods: []},
      Lunch:  {totalCalories: 0, average: 300, icons: ["icon-steak", "icon-hamburger", "icon-pizza", "icon-sandwich"],foods: []},
      Dinner:  {totalCalories: 0, average: 300, icons: ["icon-steak", "icon-hamburger", "icon-pizza", "icon-sandwich"],foods: []},
      Snacks:  {totalCalories: 0, average: 300, icons: ["icon-chips", "icon-cupcake", "icon-popcorn", "icon-apple"],foods: []}
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
          updatedMeals[meal].foods.push({name: foodName, amount: Number(d.serving_size_g), calories:  Math.ceil(d.calories)})
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
  render() {
    return (
      <div className='page'>
        <div className='plate-container' style={{filter: this.state.selectedMeal != null ? 'blur(3px)' : ''}}>
          <div className='diet-plate interactable' style={{animation: `card-load-${2 % 2 == 0 ? 'up': 'down'} ${2/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'Breakfast', icon: require('./assets/foods/icon-croissant.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Breakfast</h1>
            
            <div className='food-particles' id="particle-container-Breakfast">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-Breakfast">{this.state.meals["Breakfast"].totalCalories}kcal</h1>
          </div>
          <div className='diet-plate interactable' style={{animation: `card-load-${3 % 2 == 0 ? 'up': 'down'} ${3/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'Lunch', icon: require('./assets/foods/icon-hamburger.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Lunch</h1>
            
            <div className='food-particles' id="particle-container-Lunch">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-Lunch">{this.state.meals["Lunch"].totalCalories}kcal</h1>
          </div>
          <div className='diet-plate interactable' style={{animation: `card-load-${4 % 2 == 0 ? 'up': 'down'} ${4/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'Dinner', icon: require('./assets/foods/icon-steak.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Dinner</h1>
            
            <div className='food-particles' id="particle-container-Dinner">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-Dinner">{this.state.meals["Dinner"].totalCalories}kcal</h1>
          </div>
          <div className='diet-plate interactable' style={{animation: `card-load-${5 % 2 == 0 ? 'up': 'down'} ${5/2}s`}} onClick={()=>this.setState({selectedMeal: {name: 'Snacks', icon: require('./assets/foods/icon-cupcake.png')}})}>
            <img src={require("./assets/foods/icon-plate.png")}></img>
            <h1>Snacks</h1>
            
            <div className='food-particles' id="particle-container-Snacks">

            </div>
            <div className='hide'></div>
            
            <h1 id="kcal-Snacks">{this.state.meals["Snacks"].totalCalories}kcal</h1>
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
              <p style={{ display: 'inline' }}>{food.name} {food.amount}g</p>
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