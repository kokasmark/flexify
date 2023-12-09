import './App.css';
import { Component } from 'react';
import { ReactComponent as Muscles } from './assets/muscles.svg';
import { ReactComponent as MusclesBack } from './assets/muscles-back.svg';
import { ReactComponent as Icon_rotate } from './assets/icon-rotate.svg';


export default class MusclesView extends Component {
  state= {
    front: true
  }
  render() {
    return (
      <div>
        <div className='muscles anim'>
          {this.state.front == true ?  <Muscles /> :  <div style={{width: 1024, height:1028}}><MusclesBack style={{position: 'relative', left: 265, top:40,transform: 'scale(0.7)'}}/></div>}
          <Icon_rotate className='interactable' style={{transform: 'scale(2)', position: 'relative', top:-175,left:500,fill:'#fff !important'}} onClick={()=> this.setState({front: !this.state.front})}/>
        </div>
        
      </div>
    );
  }
}
