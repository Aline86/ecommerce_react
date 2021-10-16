import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom"
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from "redux-devtools-extension"
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import rootReducer from "./reducers"

const store = createStore(rootReducer, composeWithDevTools())

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);


