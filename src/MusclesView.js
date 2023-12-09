import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { ReactComponent as MusclesBack } from './assets/muscles-back.svg';
import { ReactComponent as Icon_rotate } from './assets/icon-rotate.svg';


export default class MusclesView extends Component {
  state= {
    front: true,
    groups: {
      trapezius: [],
      deltoid: [],
      pectoralisMajor: [],
      biceps: [33,34],
      triceps: [],
      latissimusDorsi: [],
      abdominals: [37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,57,58,61,62,66,68],
      obliques: [],
      quadriceps: [],
      hamstrings: [],
      calves: [],
      glutes: [],
      hipAdductors: [],
      hipAbductors: []
    },
    muscleData:[]
  }
  giveKeyToEachMuscle=()=>{
    var mData = []
    var muscleContainer = document.getElementById('muscle-container');
    var svgContainer = muscleContainer.children[0];
    var muscles = svgContainer.children;
    for(var i = 0; i < muscles.length; i++){
        var muscle = muscles[i];
        muscle.setAttribute("key", i);
       mData.push({"key":i, "val": 0});
    }
    this.setState({muscleData: mData})
  }
  updateMuscleGroup(group,value){
    //group: pl.: 'biceps' value: 0-3
    var muscleContainer = document.getElementById('muscle-container');
    var svgContainer = muscleContainer.children[0];
    var muscles = svgContainer.children;
    const colors = ['var(--heat-blue)','var(--heat-yellow)','var(--heat-orange)','var(--heat-red)'];
    for(var i = 0; i < this.state.groups[group].length; i++){
        var muscle = muscles[this.state.groups[group][i]];
        var key = parseInt(muscle.getAttribute("key"));
        this.state.muscleData[key].val = value;
        var color = colors[parseInt(this.state.muscleData[key].val)];
        muscle.style.fill = color;
    }
  }
  componentDidMount(){
    this.giveKeyToEachMuscle();
  }
  render() {
    return (
      <div>
        <div className='muscles anim' id='muscle-container'>
          {this.state.front == true ?  <Muscles/> :  <div style={{width: 1024, height:1028}}><MusclesBack style={{position: 'relative', left: 265, top:40,transform: 'scale(0.7)'}}/></div>}
          <Icon_rotate className='interactable' style={{transform: 'scale(2)', position: 'relative', top:-175,left:500,fill:'#fff !important'}} onClick={()=> this.setState({front: !this.state.front})}/>
        </div>
        
      </div>
    );
  }
}
