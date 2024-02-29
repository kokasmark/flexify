import './App.css';
import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from './constants';
import AuthRedirect from './authRedirect';
import swal from 'sweetalert';
import NavBarWrapper from './NavBar';
import Sidebar from './Sidebar';
import GetString from './language';
import { CallApi } from './api';
import { FaTrash } from "react-icons/fa";

const AdminPageWrapper = () => {
  const navigate = useNavigate();

  return <AdminPage navigate={navigate} />;
};

class AdminPage extends Component {

  state = {
    tables: [],
    selectedTable: '',
    data: { headers: [], body: [] },
    page: 0,
    update: []
  }
  async GetTables() {
    var r = await CallApi("admin/tables", { token: localStorage.getItem("loginToken") })
    if (r.success) {
      this.setState({ tables: r.tables, selectedTable: r.tables[0] })
      this.GetData(r.tables[0],0)

    } else {
      swal("Unauthorized!", "", "error");
      this.props.navigate('/');
    }
  }
  async GetData(table, page) {
    var r = await CallApi("admin/data", { token: localStorage.getItem("loginToken"), table: table, page: page })
    if (r.success) {
      console.log(r.json)
      this.setState({ data: r.json })

    } else {
      swal("Error!", "Error retrieving table data!", "error");
    }
  }
  componentDidMount() {
    this.GetTables()
  }
  selectTable(name) {
    this.setState({ selectedTable: name })
    this.GetData(name, 0)
  }
  async updateRows(){
    var successfulRows = 0
    for(var i = 0; i < this.state.update.length; i++){
      var row = this.state.update[i];
      console.log(`Updating table ${row.table} at id ${row.id} - ${JSON.stringify(row.values)}`)
      var r = await CallApi("admin/update", { token: localStorage.getItem("loginToken"), table: row.table, id: row.id, values: row.values })
      if (r.success) {
        successfulRows++;
      } else {
        await swal("Error!", "Error updating table data!", "error");
      }
    }

    swal("Success!", `${successfulRows} / ${this.state.update.length} rows updated!`, "success")
    this.setState({update: []})
  }
  pushToUpdateRow(table, id, field, e) {
    if (e.key == "Enter") {
      var values = {}
      values[field] = e.target.value
      this.setState({update: [...this.state.update, {table: table, id: id, values: values}]})
    }
  }
  async callDelete(table, id){
    var r = await CallApi("admin/delete", { token: localStorage.getItem("loginToken"), table: table, id: id})
        if (r.success) swal("Success!", `Deleted row ${id}!`, "success")
  }
  async deleteRow(table, id){
    swal({
      title: "Warning!",
      text: `This action cannot be undone!`,
      buttons: ["Abort","Continue"],
      icon: 'warning'
    }).then((result) => {
      if(result){
        this.callDelete(table,id)
      }
    });
  }
  render() {
    return (
      <div>
        <div className='admin'>
          <div className='table-btns'>
            {this.state.tables.map((name, index) => (
              <div className={'btn' + (this.state.selectedTable == name ? ' selected' : '')} onClick={() => this.selectTable(name)}>{name}</div>
            ))}
          </div>
          <div className='table'>
            <div className='header'>
              {this.state.data.headers.map((header, index) => (
                <h3 style={{ width: `calc(100% / ${this.state.data.headers.length} - 40px)`, marginLeft: 20, marginRight: 20 }}>{header}</h3>
              ))}
            </div>

            <div className='body'>
              {this.state.data.body.map((row, rIndex) => (
                <div className='row' key={Math.random()} style={{ animation: `from-bottom ${rIndex / 5}s ease-out` }}>
                  {row.map((data, index) => (
                    <input id={`${this.state.selectedTable}-${rIndex}-${index}`} key={`${this.state.selectedTable}-${rIndex}-${index}`}
                      style={{ width: `calc(100% / ${this.state.data.headers.length} - 50px)`, marginLeft: 20, marginRight: 20 }}
                      defaultValue={data}
                      disabled={this.state.data.headers[index] == "id"}
                      onKeyDown={(e) => this.pushToUpdateRow(this.state.selectedTable, row[0], this.state.data.headers[index], e)}
                    ></input>
                  ))}
                  <FaTrash className="delete-btn interactable" onClick={()=>this.deleteRow(this.state.selectedTable, row[0])}/>
                </div>
              ))}
            </div>

          </div>
          <div className='controls'>
              <div className='updates'>
              {this.state.update.map((row, index) => (
                <p>{row.table} at id {row.id} - {JSON.stringify(row.values)}</p>
              ))}
              </div>
              <div className='btns'>
                <h1>Control Panel</h1>
                <h2 className='btn' style={{backgroundColor: "#22cc33"}} onClick={()=>this.updateRows()}>Update Rows</h2>
              </div>
          </div>
          <NavBarWrapper />
          <Sidebar />
        </div>
      </div>
    );
  }
}
export default AuthRedirect(AdminPageWrapper);