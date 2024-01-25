import './App.css';
import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {host} from './constants';
import AuthRedirect from './authRedirect';
import swal from 'sweetalert';
import NavBarWrapper from './NavBar';
import Sidebar from './Sidebar';
import GetString from './language';
const AdminPageWrapper = () => {
  const navigate = useNavigate();

  return <AdminPage navigate={navigate} />;
};

class AdminPage extends Component {

  state = {
    hidePassword: true,
    admins: ["kokas_teszt",""]
  }
  componentDidMount(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"token": localStorage.getItem('loginToken'), location: "web"});

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`http://${host}:3001/api/user`, requestOptions)
      .then(response => response.text())
      .then((response) => {
        var r = JSON.parse(response);
        if(r.success){
          const exists = this.state.admins.some(v => (v === r.username));
          if(exists){
              swal(GetString("alert-login-success"), GetString("navbar-welcome")+ r.username, "success")
          }else{
            swal("Oops!", "You are not permitted to enter this page!", "error");
            const { navigate } = this.props;
            navigate('/');
          }
        }else{
          
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <div>
        <h1 style={{textAlign: "center", width: "100%", position: "relative", top: 100, color: 'white'}}>Admin</h1>
        <div style={{marginLeft: 310, marginTop: 100}}>
          <div style={{textAlign: "center", width: 400, height: 500, backgroundColor: 'var(--contrast)', borderRadius: 10, position: "relative", top: 100, color: 'white'}}>
            <h2>Manage Users</h2>
          </div>
          <div style={{textAlign: "center", width: 400, height: 500, backgroundColor: 'var(--contrast)', borderRadius: 10, position: "relative", left: 450, top: -400, color: 'white'}}>
            <h2>Manage Templates</h2>
          </div>
          <div style={{textAlign: "center", width: 400, height: 500, backgroundColor: 'var(--contrast)', borderRadius: 10, position: "relative", left: 900, top: -900, color: 'white'}}>
            <h2>Manage Workouts</h2>
          </div>
        </div>
        <NavBarWrapper/>
        <Sidebar/>
      </div>
    );
  }
}
export default AuthRedirect(AdminPageWrapper);