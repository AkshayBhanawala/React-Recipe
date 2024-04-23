import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/Fonts/Metropolis/Metropolis.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from "react-router-dom";
import Config from './helpers/Config';
import App from './App';

ReactDOM.render(
	<React.StrictMode>
		{
			Config.isHashRoute
			?	<HashRouter><App /></HashRouter>
			: <BrowserRouter><App /></BrowserRouter>
		}
	</React.StrictMode>,
	document.getElementById('root')
);