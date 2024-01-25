import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { ReactComponent as MusclesBack } from './assets/muscles-back.svg';
import { ReactComponent as W_Muscles } from './assets/women-muscles.svg';
import { ReactComponent as W_MusclesBack } from './assets/women-muscles-back.svg';
import { ReactComponent as Icon_rotate } from './assets/icon-rotate.svg';


export default class MusclesView extends Component {
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
    animation: 'fade-in'
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
  setColor = () => {
    const colors = ['var(--heat-blue)', 'var(--heat-yellow)', 'var(--heat-orange)', 'var(--heat-red)'];
    if (this.state.front) {
      for (var i = 0; i < this.state.muscleData.length; i++) {
        var muscle = document.getElementById(i);
        var color = colors[parseInt(this.state.muscleData[i].val)];
        muscle.style.fill = color;
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
        this.state.muscleData[key].val = value;
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
    if (this.state.animation == 'fade-in') {
      this.setState({ animation: 'fade-out' })
      await new Promise(r => setTimeout(r, 200))
      this.setState({ front: !this.state.front });
      this.setState({ animation: 'fade-in' })
    }
  }
  Draw(){
    var muscles = this.props.muscles;
        const muscleCounts = {};
        var count = 0;
        // Assuming 'muscles' is an array of muscle objects
        for (var i = 0; i < muscles.length; i++) {
          var muscleData = JSON.parse(muscles[i]);
          for (var ii = 0; ii < muscleData.length; ii++) {
            var name = muscleData[ii]; // Assuming the muscle is the first element in the array
            count++;
            // Count the occurrences of each muscle
            muscleCounts[name] = (muscleCounts[name] || 0) + 1;
          }

        }

        // Calculate the average count for each muscle group
        const averageCounts = {};

        for (const muscleName in muscleCounts) {
          const totalOccurrences = muscleCounts[muscleName];
          const averageCount = totalOccurrences / count; // Adjust the denominator if needed
          averageCounts[muscleName] = averageCount;
        }

        var tipIndex = 0;
        // Map the average counts to the range [0, 3] and update muscle groups
        for (const muscleName in averageCounts) {
          const mappedValue = Math.min(3, Math.max(1, Math.round(averageCounts[muscleName] * 3)));
          this.updateMuscleGroup(muscleName, mappedValue);
          if (document.getElementById(this.findMuscleIndex(muscleName)) != null) {
            document.body.innerHTML += `<p style='position: absolute; top: ${300 + 50 * tipIndex}px; ${tipIndex % 2 == 0 ? 'right: 400px;' : 'left: 400px;'} color: white;' id='tip-${tipIndex}'>${muscleName}</p>`
            this.connect(document.getElementById(this.findMuscleIndex(muscleName)), document.getElementById(`tip-${tipIndex}`), "#fff", 1)
            tipIndex++;
          }

        }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.front !== this.state.front) {
      if (this.props.muscles != null) {
        this.Draw()
      }
    }
    if(this.props.muscles != prevProps.muscles){
      this.Draw()
    }
  }
  getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left - 10,
      top: rect.top - 10,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight
    };
  }
  connect(div1, div2, color, thickness) { // draw a line connecting elements
    var off1 = this.getOffset(div1);
    var off2 = this.getOffset(div2);
    // bottom right
    var x1 = off1.left + off1.width;
    var y1 = off1.top + off1.height;
    // top right
    var x2 = off2.left + off2.width;
    var y2 = off2.top;
    // distance
    var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    // make hr
    var htmlLine = "<div style='z-index: 1;padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //
    // alert(htmlLine);
    document.body.innerHTML += htmlLine;
  }
  componentDidMount() {
    this.setState({ men: (localStorage.getItem('anatomy') != null ? (localStorage.getItem('anatomy') == "Masculine" ? true : false) : true) })
    this.createMuscleData();
  }
  render() {
    return (
      <div>
        <div className={'muscles anim load-anim ' + this.state.animation} id='muscle-container' onClick={(e) => this.muscleClicked(e)}>


          {this.state.men == true ?
            <div>{this.state.front == true ? <Muscles style={{ width: 1024, height: 1028 }} /> : <div ><MusclesBack style={{ width: 1024, height: 1028, transform: 'scale(0.65)' }} /></div>}</div>
            : <div>{this.state.front == true ? <W_Muscles style={{ width: 1024, height: 1028 }} /> : <div ><W_MusclesBack style={{ width: 1024, height: 1028, transform: 'scale(0.65)' }} /></div>}</div>
          }


          <Icon_rotate className='interactable' style={{ transform: 'scale(2)', position: 'relative', top: -175, left: 500, fill: '#fff !important' }} onClick={() => this.rotate()} />
        </div>

      </div>
    );
  }
}
