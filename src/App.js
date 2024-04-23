import './App.css';
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Config from './helpers/Config';
import SearchIcon from './assets/Icons/Icon feather-search.png'
import Recipes from './components/Recipes.component';
import RecipeDetails from './components/RecipeDetails.component';
import BGIMG_BottomLeft from './assets/Images/Illustration1.png';
import BGIMG_TopRight from './assets/Images/Illustration2.png';
import BGIMG_Pizza from './assets/Images/Illustration3.png';
import BGIMG_Cheese from './assets/Images/Illustration4.png';
import BGIMG_BabyTomatoe from './assets/Images/Illustration5.png';
import SVGLoading from './components/_Custom/SVGLoading';
import RecipesSearch from './components/RecipesSearch.component';

class App extends Component {
	static displayName = 'App';
	_isMounted = false;
	LoadingRef = React.createRef();
	TB_SearchQRef = React.createRef();

	constructor(props) {
		super(props);

		this.state = {
			searchQ: "",
			redirectToHome: false,
			redirectToSearch: false
		};
		this.onKeyUp_TBSearchQ = this.onKeyUp_TBSearchQ.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log("App", "Mounted");
		// Code to run when component is loaded
		//this.props.history.push('/');
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("App", "Unmounted");
	}

	onKeyUp_TBSearchQ(event) {
		// if (event.keyCode !== 13) {
		// 	return true;
		// }
		const isCurrentlySearchPath = this.props.history.location.pathname.includes('/search/');
		if (this.TB_SearchQRef.current.value) {
			const searchRoute = `/search/${this.TB_SearchQRef.current.value}`;
			if (isCurrentlySearchPath) {
				this.props.history.replace(searchRoute);
			} else {
				this.props.history.push(searchRoute)
			}
		} else if (isCurrentlySearchPath) {
			this.props.history.goBack();
		}
		return false;
	}

	render() {
		if (Config.isDebug) console.log("App", "render", this.state);
		return (
			<>
				{(this.state.redirectToHome) ? <Redirect to={`/`} /> : <></>}
				<div className="PageLoading show" ref={this.LoadingRef}><SVGLoading /></div>
				<img alt="" className="BGIMG BottomLeft" src={BGIMG_BottomLeft} />
				<img alt="" className="BGIMG TopRight" src={BGIMG_TopRight} />
				<img alt="" className="BGIMG Pizza" src={BGIMG_Pizza} />
				<img alt="" className="BGIMG Cheese" src={BGIMG_Cheese} />
				<img alt="" className="BGIMG BabyTomatoe" src={BGIMG_BabyTomatoe} />
				<Container className="MainContainer">
					<div className="Content">
						<div className="SearchBar" onSubmit={this.onSubmit_Search}>
							<input id="tb_search" ref={this.TB_SearchQRef} onKeyUp={this.onKeyUp_TBSearchQ} type="text" className="tb_search" placeholder="Search your favourite recipe..." required={true} />
							<label htmlFor="tb_search">
								<img alt="Search Icon" src={SearchIcon} />
							</label>
						</div>
						<div className="PageHolder">
							<Switch>
								<Route path={["/"]} exact component={(props) => <Recipes {...props} PageLoadingPlaceholder={this.LoadingRef} />} />
								{/* <Route path={["/search/:searchQ"]} exact component={(props) => <Recipes {...props} PageLoadingPlaceholder={this.LoadingRef} />} /> */}
								<Route path={["/search/:searchQ"]} exact component={(props) => <RecipesSearch {...props} PageLoadingPlaceholder={this.LoadingRef} />} />
								<Route path="/:id" exact component={(props) => <RecipeDetails {...props} PageLoadingPlaceholder={this.LoadingRef} />} />
							</Switch>
						</div>
					</div>
					<div className="Footer">
						<div>YOUR FOOD TASTES YUMMY</div>
					</div>
				</Container>
			</>
		)
	};
}

export default withRouter(App);