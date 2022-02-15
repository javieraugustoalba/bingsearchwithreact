import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import IndexForm from './components/IndexForm';
import JsonComponent from './components/JsonComponent';
import HtmlComponent from './components/HttpComponent';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <IndexForm />
  </React.StrictMode>,
  document.getElementById('root')
  
);

ReactDOM.render(
  <React.StrictMode>
    <JsonComponent />
  </React.StrictMode>,
  document.getElementById('json')
  
);
ReactDOM.render(
  <React.StrictMode>
    <HtmlComponent />
  </React.StrictMode>,
  document.getElementById('http')
  
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
