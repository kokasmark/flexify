import './App.css';
import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {host} from './constants';
import AuthRedirect from './authRedirect';
import swal from 'sweetalert';
import NavBarWrapper from './NavBar';
import Sidebar from './Sidebar';
import GetString from './language';
import { CallApi } from './api';
const AdminPageWrapper = () => {
  const navigate = useNavigate();

  return <AdminPage navigate={navigate} />;
};

class AdminPage extends Component {

  state = {
    tables: [],
    selectedTable: '',
    data: {headers: [], body: []},
    page: 0
  }
  async GetTables(){
    var r = await CallApi("admin/tables", {token: localStorage.getItem("loginToken")})
    if(r.success){
      this.setState({tables: r.tables, selectedTable: r.tables[0]})
      this.GetData(r.tables[0])

    }else{
      swal("Unauthorized!","", "error");
      this.props.navigate('/');
    }
  }
  async GetData(table,page){
    var r = await CallApi("admin/data", {token: localStorage.getItem("loginToken"), table: table, page: page})
    if(r.success){
      console.log(r.json)
      this.setState({data: r.json})

    }else{
      swal("Error!","Error retrieving table data!", "error");
    }
  }
  componentDidMount(){
    this.GetTables()
  }
  selectTable(name){
    this.setState({selectedTable: name})
    this.GetData(name,0)
  }
  render() {
    return (
      <div>
      <div className='admin'>
        <div className='table-btns'>
          {this.state.tables.map((name, index) => (
            <div className={'btn'+(this.state.selectedTable == name ? ' selected':'')} onClick={()=>this.selectTable(name)}>{name}</div>
          ))}
        </div>
        <div className='table'>
            <div className='header'>
              {this.state.data.headers.map((header, index) => (
              <h3 style={{width: `calc(100% / ${this.state.data.headers.length} - 40px)`, marginLeft: 20, marginRight: 20}}>{header}</h3>
            ))}
            </div>

            <div className='body'>
            {this.state.data.body.map((row, rIndex) => (
               <div className='row' key={Math.random()} style={{animation: `from-bottom ${rIndex/5}s ease-out`}}>
                  {row.map((data, index) => (
                    <input id={`${this.state.selectedTable}-${rIndex}-${index}`} key={`${this.state.selectedTable}-${rIndex}-${index}`} 
                    style={{width: `calc(100% / ${this.state.data.headers.length} - 40px)`, marginLeft: 20, marginRight: 20}} 
                    defaultValue={data}
                    disabled={this.state.data.headers[index] == "id"}
                    ></input>
                ))}
               </div>
            ))}
            </div>
        </div>
        <NavBarWrapper/>
        <Sidebar/>
      </div>
      </div>
    );
  }
}
export default AuthRedirect(AdminPageWrapper);