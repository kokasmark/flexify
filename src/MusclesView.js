import './App.css';
import React, { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { ReactComponent as MusclesBack } from './assets/muscles-back.svg';
import { ReactComponent as W_Muscles } from './assets/women-muscles.svg';
import { ReactComponent as W_MusclesBack } from './assets/women-muscles-back.svg';
import { ReactComponent as Icon_rotate } from './assets/icon-rotate.svg';
import icon_lightbulb from './assets/icon-lightbulb.png'
import GetString from './language';
import { RiErrorWarningLine, RiCheckboxCircleLine,RiMoreFill } from "react-icons/ri";


export default class MusclesView extends Component {
  tipsRef = React.createRef();
  state = {
    front: true,
    men: true,
    groups: {
      men: {
        traps: [146, 147, 148, 149, 21, 22, 23, 24],
        shoulder: [26, 27, 29, 30, 150, 151],
        chest: [25, 28, 31, 32],
        biceps: [33, 34],
        triceps: [154, 155, 159, 160, 155, 158, 161],
        lats: [156, 157],
        abs: [45, 46, 51, 52, 57, 58, 66, 68],
        obliques: [37, 38, 39, 40, 41, 42, 44, 43, 44, 47, 49, 48, 50, 61, 62, 170, 171],
        quadriceps: [71, 73, 91, 104, 72, 74, 92, 103, 75, 77],
        calves: [206, 207, 208, 209],
        leg: [105, 113, 117, 107, 115, 119, 106, 114, 118, 108, 116, 120, 212, 210, 211, 213],
        forearm: [55, 59, 65, 69, 63, 56, 60, 67, 64, 70, 164, 162, 167, 168, 163, 169, 166, 165],
        glutes: [174, 175, 172, 173, 176, 177],
        hamstrings: [198, 202, 200, 204, 192, 193, 201, 205, 203, 199],
        adductors: [76, 79, 87, 93, 94, 88, 82, 78],
        midBack: [152, 153],
        neck: [18, 19, 20]
      },

      women: {
        traps: [88, 89],
        shoulder: [7, 8, 9, 12, 90, 91],
        chest: [13, 14],
        biceps: [15, 16],
        triceps: [21, 22, 98, 100, 94, 95, 99, 101],
        lats: [96, 97, 104, 105],
        abs: [23, 24, 29, 30, 37, 38, 42, 43],
        obliques: [17, 19, 25, 27, 33, 18, 20, 26, 28, 34, 112, 113],
        quadriceps: [63, 48, 44, 66, 45, 49, 64, 67],
        calves: [138, 140, 141, 139],
        leg: [78, 76, 74, 75, 77, 79, 144, 142, 143, 145],
        forearm: [31, 35, 39, 32, 40, 41, 36, 109, 106, 111, 110, 107, 108],
        glutes: [114, 115, 116, 117],
        hamstrings: [132, 134, 136, 131, 130, 137, 135, 133],
        adductors: [46, 47, 54, 55],
        midBack: [92, 93],
        neck: [3, 4, 2]
      }
    },
    muscleData: [],
    frontLastKey: 138,
    animation: 'fade-in',
    tips: [{text:"You have no finished workouts in this time period!",level:0}],
    tip_icons: [<RiMoreFill className='tip-icon' style={{color: "var(--heat-yellow)"}}/>, <RiCheckboxCircleLine className='tip-icon' style={{color: "var(--heat-orange)"}}/>, <RiErrorWarningLine className='tip-icon' style={{color: "var(--heat-red)"}}/>]
  }
  getGroup() {
    return this.state.men == true ? this.state.groups.men : this.state.groups.women;
  }
  findMuscleGroup = (index) => {
    const groups = this.getGroup();

    for (const groupName in groups) {
      for (var i = 0; i < groups[groupName].length; i++) {
        if (groups[groupName][i] == (index)) {
          return { name: groupName, group: groups[groupName] };
        }
      }
    }
  }
  findMuscleIndex = (group) => {
    return this.getGroup()[group][0]
  }
  createMuscleData() {
    var mData = []
    for (var i = 0; i < 220; i++) {
      mData.push({ "key": i, "val": 0 });
    }
    this.setState({ muscleData: mData });
  }
  muscleLoadAnimation(){
    console.log("muscle load")
    for (var i = 0; i < this.state.muscleData.length; i++) {
      var muscle = document.getElementById(i);
      try{
        muscle.style.animation = `muscle-load ${this.state.front ? i/100 : (i-(this.state.men == true ? 138 : 87))/100}s ease-out`;
      }catch{

      }
    
  }
  }
  clearColor(){
    const colors = ['var(--heat-blue)', 'var(--heat-yellow)', 'var(--heat-orange)', 'var(--heat-red)'];
    var updatedMuscleData = this.state.muscleData;
      for (var i = 0; i < this.state.muscleData.length; i++) {
        var color = colors[0];
        var muscle = document.getElementById(i);
        updatedMuscleData[i].val = 0;
        try{
          muscle.style.fill = color;
        }catch{

        }
      
    }
    this.setState({muscleData: updatedMuscleData})
  }
  setColor = () => {
    const colors = ['var(--heat-blue)', 'var(--heat-yellow)', 'var(--heat-orange)', 'var(--heat-red)'];

      for (var i = 0; i < this.state.muscleData.length; i++) {
        var muscle = document.getElementById(i);
        var color = colors[parseInt(this.state.muscleData[i].val)];
        try{
        muscle.style.fill = color;
        }catch{

        }
      
    }
  }
  updateMuscleGroup(group, value) {
    //group: pl.: 'biceps' value: 0-3
    var muscleContainer = document.getElementById('muscle-container');
    var svgContainer;
    var muscles;//THE PARENT OF THE MUSCLES

    if (this.state.men) {
      svgContainer = this.state.front == true ? muscleContainer.children[0] : muscleContainer.children[0].children[0].children[0];
      muscles = svgContainer.children[0].children;//THE PARENT OF THE MUSCLES
    } else {
      svgContainer = this.state.front == true ? muscleContainer.children[0] : muscleContainer.children[0].children[0];
      muscles = svgContainer.children[0].children[0].children;//THE PARENT OF THE MUSCLES
    }
    const colors = ['var(--heat-blue)', 'var(--heat-yellow)', 'var(--heat-orange)', 'var(--heat-red)'];
    for (var i = 0; i < this.getGroup()[group].length; i++) {
      try {
        var muscle = muscles[this.state.front == true ? this.getGroup()[group][i] : this.getGroup()[group][i] - (this.state.men == true ? 138 : 87)];
        var key = parseInt(muscle.id);
        this.state.muscleData[key].val = value != -1 ? value : this.state.muscleData[key].val;
        var color = colors[parseInt(this.state.muscleData[key].val)];
        muscle.style.fill = color;
      } catch {
        continue;
      }
    }
  }
  muscleClicked(e) {
    var data = { "id": 0, "groupName": "", group: [] }
    try {
      if (e.target.tagName == 'path') {
        data.id = e.target.id;
        var d = this.findMuscleGroup(e.target.id);
        data.groupName = d.name;
        data.group = d.group;
      }
      try { this.props.chooseCallback({ name: data.groupName, group: data.group }) } catch { }//for Create Page
    } catch {

    }
    return data;
  }
  async rotate() {
    await new Promise(r => setTimeout(r, 200))
    this.setState({ front: !this.state.front});
  }
  Draw() {
    var muscles = this.props.muscles;
    let t = []
    this.clearColor()
    for (const [key,value] of Object.entries(muscles)) {
      const muscleName = key;
      const mappedValue = value;
      this.updateMuscleGroup(muscleName, mappedValue);
      const colors = ['var(--heat-blue)', 'var(--heat-yellow)', 'var(--heat-orange)', 'var(--heat-red)'];
      if (document.getElementById(this.findMuscleIndex(muscleName)) != null) {
        switch (mappedValue) {
          case 1:
            t.push({text: GetString("tip-level-1").replace("!muscle!",`<strong style="color: ${colors[mappedValue]}">${GetString('muscle-'+muscleName)}</strong>`),level: 0, group: muscleName})
            break;
          case 2:
            t.push({text: GetString("tip-level-2").replace("!muscle!",`<strong style="color: ${colors[mappedValue]}">${GetString('muscle-'+muscleName)}</strong>`),level: 1, group: muscleName})
            break;
          case 3:
            t.push({text: GetString("tip-level-3").replace("!muscle!",`<strong style="color: ${colors[mappedValue]}">${GetString('muscle-'+muscleName)}</strong>`),level: 2, group: muscleName})
            break;
          default:
            break;
        }

      }
      
    }
    if(Object.entries(muscles).length > 0){
      this.setState({ tips: t })
    }
    else{
      this.setState({ tips: [{text:"You have no finished workouts in this time period!",level:0}] })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.front !== this.state.front) {
      if (this.props.muscles != null) {
        this.Draw();
      }
      this.muscleLoadAnimation()
    }
    if (this.props.muscles != prevProps.muscles) {
      this.Draw()
      this.muscleLoadAnimation()
    }
    if(this.props.autoRotate){
      this.props.array.forEach(muscle => {
        this.updateMuscleGroup(muscle, 2)
      });
    }
  }
  async AutoRotate(){
    
    await new Promise(r => setTimeout(r, 3000))
    if(this.props.autoRotate == true){
      this.rotate()
    }
    this.AutoRotate()
    
  }
  componentDidMount() {
    this.setState({ men: (localStorage.getItem('anatomy') != null ? (localStorage.getItem('anatomy') == "Masculine" ? true : false) : true) })
    this.createMuscleData();
    if(this.props.autoRotate != null){
      this.AutoRotate()
    }
  }
  highlight(group){
      for (var i = 0; i < this.state.muscleData.length; i++) {
        var muscle = document.getElementById(i);
        var color = "var(--contrast-A)";
        try{
          muscle.style.fill = color;
        }catch{

        }
      }

      this.updateMuscleGroup(group,-1)
  }
  hide(){
    this.setColor()
  }
  render() {
    return (
      <div>
        <div className={'muscles anim load-anim ' + this.state.animation} id='muscle-container' onClick={(e) => this.muscleClicked(e)}>


          {this.state.men == true ?
            <div>{this.state.front == true ? <Muscles style={{ width: 1024, height: 1028 }} /> : <div ><MusclesBack style={{ width: 1024, height: 1028, transform: 'scale(0.65)' }} /></div>}</div>
            : <div>{this.state.front == true ? <W_Muscles style={{ width: 1024, height: 1028 }} /> : <div ><W_MusclesBack style={{ width: 1024, height: 1028, transform: 'scale(0.65)' }} /></div>}</div>
          }


          {this.props.autoRotate == null && <Icon_rotate className='interactable' style={{ transform: 'scale(2)', position: 'relative', top: -175, left: 500, fill: '#fff !important' }} onClick={() => this.rotate()} />}
        </div>
        {this.props.showTips != null && <div className={'tips-container '+ this.state.animation} style={{ position: 'relative', top: -800, left: 650 }}>
          {this.state.tips.map((tip, index) => (
            <div key={Math.random()} style={{ left: index % 2 == 0 ? -550 : 200, animation: `tip-load ${1+index/5}s ease-out` }} 
            className='interactable home-tip' onMouseEnter={()=>this.highlight(tip.group)} onMouseLeave={()=>this.hide()}>
              {this.state.tip_icons[tip.level]}
              <div style={{ display: 'inline-block', width: 250 }} key={index} dangerouslySetInnerHTML={{ __html: tip.text }}></div>
            </div>
          ))}
        </div>}
      </div>
    );
  }
}
