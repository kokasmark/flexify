import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { ReactComponent as MusclesBack } from './assets/muscles-back.svg';
import { ReactComponent as Icon_rotate } from './assets/icon-rotate.svg';


export default class MusclesView extends Component {
  state= {
    front: true,
    groups: {
      trapezius: [146,147,148,149],
      shoulder: [26,27,29,30,150,151],
      chest: [25,28,31,32],
      biceps: [33,34],
      triceps: [154,155,159,160,155,158,161],
      lats: [156,157],
      abs: [45,46,51,52,57,58,66,68],
      obliques: [37,38,39,40,41,42,44,43,44, 47,49,48,50,61,62],
      quadriceps: [71,73,91,104,72,74,92,103,75,77,198,202,200,204,192,193,201,205,203,199],
      calves: [206,207,208,209],
      leg: [105,113,117,107,115,119,106,114,118,108,116,120,212,210,211,213],
      forearm: [55,59,65,69,63,56,60,67,64,70,164,162,167,168,163,169,166,165],
      gluteus: [174,175]
    },
    muscleData:[],
    frontLastKey: 138
  }
  findMuscleGroup = (index) =>{
    const groups = this.state.groups;

    for (const groupName in groups) {
      for(var i = 0; i < groups[groupName].length; i++){
        if (groups[groupName][i] == (index)) {   
            return {name:groupName,group:groups[groupName]};
        }
      }
    }
}
  createMuscleData(){
    var mData = []
    for(var i = 0; i < 220; i++){
      mData.push({"key":i, "val":0});
    }
    this.setState({muscleData: mData});
  }
  setColor=()=>{
    const colors = ['var(--heat-blue)','var(--heat-yellow)','var(--heat-orange)','var(--heat-red)'];
    if(this.state.front){
      for(var i = 0; i < this.state.muscleData.length; i++){
        var muscle = document.getElementById(i);
        var color = colors[parseInt(this.state.muscleData[i].val)];
        muscle.style.fill = color;
      }
    }
  }
  updateMuscleGroup(group,value){
    //group: pl.: 'biceps' value: 0-3
    var muscleContainer = document.getElementById('muscle-container');
    var svgContainer = this.state.front == true? muscleContainer.children[0]: muscleContainer.children[0].children[0].children[0];
    var muscles = svgContainer.children;
    const colors = ['var(--heat-blue)','var(--heat-yellow)','var(--heat-orange)','var(--heat-red)'];
    for(var i = 0; i < this.state.groups[group].length; i++){
      try{
        var muscle = muscles[this.state.front == true? this.state.groups[group][i]:this.state.groups[group][i]-138];
        var key = parseInt(muscle.id);
        this.state.muscleData[key].val = value;
        var color = colors[parseInt(this.state.muscleData[key].val)];
        muscle.style.fill = color;
      }catch{
        continue;
      }
    }
  }
  muscleClicked(e){
    var data = {"id": 0, "groupName": "", group:[]}
    try{
      if(e.target.tagName == 'path'){
        data.id = e.target.id;
        var d = this.findMuscleGroup(e.target.id);
        data.groupName = d.name;
        data.group = d.group;
      }
      try{this.props.chooseCallback({name: data.groupName, group:data.group})}catch{}//for Create Page
    }catch{

    }
      return data;
  }
  rotate(){
    this.setState({front: !this.state.front});
    
   
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.front !== this.state.front) {
      if(this.props.muscles != null){
      var muscles = this.props.muscles;
      const muscleCounts = {};

      // Assuming 'muscles' is an array of muscle objects
      for (var i = 0; i < muscles.length; i++) {
        var muscle = muscles[i];
        var muscleData = JSON.parse(muscle);
        var name = muscleData.muscle;
      
        // Count the occurrences of each muscle
        muscleCounts[name] = (muscleCounts[name] || 0) + 1;
      }
      
      // Calculate the average count for each muscle group
      const averageCounts = {};
      
      for (const muscleName in muscleCounts) {
        const totalOccurrences = muscleCounts[muscleName];
        const averageCount = totalOccurrences / muscles.length; // Adjust the denominator if needed
        averageCounts[muscleName] = averageCount;
      }
      
      // Map the average counts to the range [0, 3] and update muscle groups
      for (const muscleName in averageCounts) {
        const mappedValue = Math.min(3, Math.max(1, Math.round(averageCounts[muscleName] * 3)));
        this.updateMuscleGroup(muscleName, mappedValue);
      }
    }
    }
  }
  componentDidMount(){
    this.createMuscleData();
  }
  componentWillUnmount(){
    //this.setColor();
  }
  render() {
    return (
      <div>
        <div className='muscles anim load-anim' id='muscle-container' onClick={(e)=>this.muscleClicked(e)}>
          {this.state.front == true ?  <Muscles onLoad={()=> console.log('+')}/> :  <div style={{width: 1024, height:1028}}><MusclesBack style={{position: 'relative', left: 265, top:35,transform: 'scale(0.7)'}}/></div>}
          <Icon_rotate className='interactable' style={{transform: 'scale(2)', position: 'relative', top:-175,left:500,fill:'#fff !important'}} onClick={()=>this.rotate()}/>
        </div>

        {/*CSAK TESZTELÉSHEZ
        
        <div style={{position: 'absolute',top: 200,width:200, height:200, backgroundColor: 'var(--contrast)'}}>
          <input id='test-group' placeholder='Muscle group name for testing'></input>
          <input id='test-value' placeholder='value'></input>
          <button onClick={()=> this.updateMuscleGroup(document.getElementById('test-group').value, document.getElementById('test-value').value)}>Set value</button>
        </div>
        
        */}
        
      </div>
    );
  }
}
