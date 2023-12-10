import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import history from './history';
import BrowsePage from './BrowsePage';
import PlanPage from './PlanPage';
import CreatePage from './CreatePage';
import DietPage from './DietPage';
import SignUpWrapper from './SignUpPage';
import SignInWrapper from './SignInPage';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter history={history}>
  <Routes>
    <Route exact={true} path="/" element={<App />} />
    <Route exact={true} path="/browse" element={<BrowsePage />} />
    <Route exact={true} path="/plan" element={<PlanPage />} />
    <Route exact={true} path="/create" element={<CreatePage />} />
    <Route exact={true} path="/diet" element={<DietPage />} />

    <Route exact={true} path="/signIn" element={<SignInWrapper />} />
    <Route exact={true} path="/signUp" element={<SignUpWrapper />} />
  </Routes>
</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
