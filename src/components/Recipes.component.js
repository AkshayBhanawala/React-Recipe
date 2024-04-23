import './Recipes.component.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Config from '../helpers/Config';
import APIRoutes from '../helpers/APIRoutesForClient';
import OverlayRecipeDetails from './_Custom/OverlayRecipeDetails';
import LazyImage from './LazyImage.component';
import Heart from '../assets/Icons/Icon feather-heart.png';
import HeartColored from '../assets/Icons/Icon feather-heart-color.png';
import HelperMethods from '../helpers/HelperMethods';

class Recipes extends Component {
	static displayName = 'Recipes';
	_isMounted = false;
	PageLoadingPlaceholder = undefined;
	static serverDataLoaded = false;

	constructor(props) {
		super(props);

		this.PageLoadingPlaceholder = this.props.PageLoadingPlaceholder;

		this.state = {
			_isFetching: true,
			serverRecipes: undefined,
			searchRecipes: undefined,
			ORecipeDetails: undefined
		};
		this.onClick_Like = this.onClick_Like.bind(this);
		this.onClick_ViewMore = this.onClick_ViewMore.bind(this);
		this.onClick_QuickView = this.onClick_QuickView.bind(this);
		this.onClose_OverlayRecipeDetails = this.onClose_OverlayRecipeDetails.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
		this.getRecipes();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	async getRecipes() {
		if (this.props.searchQ || this.props.match.params.searchQ) {
			if (!localStorage.getItem(Config.LSNames.recipes && !Recipes.serverDataLoaded)) {
				await this.getServerRecipes();
				this.setLocalRecipes();
			}
			this.getSearchRecipes();
		} else if (!Recipes.serverDataLoaded) {
			this.getServerRecipes();
		} else if (Recipes.serverDataLoaded) {
			this.setState({ _isFetching: false });
			this.setLocalRecipes();
		}
	}

	async getServerRecipes(useUiRecipeJson = false) {
		this.setState({
			_isFetching: true
		});
		const urlToUse = useUiRecipeJson ? APIRoutes.GetRecipesFromUI : APIRoutes.GetRecipes;
		axios.get(urlToUse, undefined).then((res) => {
			if (Config.isDebug) console.log(this.constructor.displayName, "getRecipes", "response:", res);
			if (this._isMounted) {
				if (res?.data?.length) {
					res.data.forEach(i => {
						i.description = i.description ? i.description : HelperMethods.get_LoremIpsumText()
						i.cost = i.cost ? i.cost : HelperMethods.get_RandomInteger(100, 500);
						i.calories = i.calories ? i.calories : HelperMethods.get_RandomInteger(100, 500);
						i.servings = i.servings ? i.servings : HelperMethods.get_RandomInteger(1, 10);
						i.totalTime = i.totalTime ? i.totalTime : HelperMethods.get_RandomInteger(10, 120);
					});
				}
				this.setState({
					_isFetching: false,
					serverRecipes: res.data
				}, () => {
					localStorage.setItem(Config.LSNames.recipes, JSON.stringify(this.state.serverRecipes));
				});
			}
		}).catch((err) => {
			this.setState({
				_isFetching: false
			});
			this.getServerRecipes(true);
			if (Config.isDebug) console.log(this.constructor.displayName, "getRecipes", "error:", err);
		});
		Recipes.serverDataLoaded = true;
	}

	getSearchRecipes() {
		const searchQ = this.props.searchQ || this.props.match.params.searchQ;
		let recipes = localStorage.getItem(Config.LSNames.recipes);
		recipes = JSON.parse(recipes);
		recipes = recipes.filter((obj) => obj.title.toLowerCase().includes(searchQ.toLowerCase()));
		if (recipes && recipes.length > 0) {
			this.setState({
				searchQ: searchQ,
				searchRecipes: recipes
			});
		}
	}

	setLocalRecipes() {
		this.setState({
			serverRecipes: JSON.parse(localStorage.getItem(Config.LSNames.recipes))
		});
	}

	onClick_ViewMore(event, id) {
		event.stopPropagation();
		this.props.history.push('/' + id);
	}

	onClick_QuickView(event, id) {
		event.stopPropagation();
		this.setState({
			ORecipeDetails: {
				show: true,
				recipe: this.state.serverRecipes.find((obj) => obj.id === id)
			}
		});
	}

	onClick_Like(event) {
		event.stopPropagation();
		const LikedClass = "Liked";
		if (event.currentTarget.classList.contains(LikedClass)) {
			event.currentTarget.classList.remove(LikedClass);
		} else {
			event.currentTarget.classList.add(LikedClass);
		}
	}

	onClose_OverlayRecipeDetails() {
		this.setState({
			ORecipeDetails: undefined
		});
	}

	render() {
		this.render_PageLoader();
		if (this.state._isFetching) { return <></> }
		return (
			<>
				{this.render_OverlayRecipeDetails()}
				<div className="Recipes">
					<div className="Title">
						Our Recipes
					</div>
					{this.render_Recipes()}
				</div>
			</>
		);
	};

	render_PageLoader() {
		if (this.state._isFetching) {
			if (this.PageLoadingPlaceholder.current != null) {
				if (!this.PageLoadingPlaceholder.current.classList.contains("show")) {
					this.PageLoadingPlaceholder.current.classList.add("show")
				}
			}
			return (<></>);
		}
		if (this.PageLoadingPlaceholder.current) {
			this.PageLoadingPlaceholder.current.classList.remove("show")
		}
	}

	render_OverlayRecipeDetails() {
		if (this.state.ORecipeDetails) {
			return (
				<OverlayRecipeDetails
					show={this.state.ORecipeDetails.show}
					recipe={this.state.ORecipeDetails.recipe}
					onClose={this.onClose_OverlayRecipeDetails}
				/>
			);
		}
	}

	render_Recipes() {
		let recipes = [];
		let counter = 0;
		if (this.props.searchQ || this.props.match.params.searchQ) {
			recipes = this.state.searchRecipes;
		} else {
			recipes = this.state.serverRecipes;
		}
		if (!recipes || recipes.length === 0) {
			return (
				<div className="NoRecipes">
					<span className="Title">Ohh no!!!</span>
					<span>There are no recipes available!</span>
				</div>
			)
		}
		return (
			<div className="RecipeCards">
				{
					recipes.map((recipe) => {
						return (
							<div
								key={'key_' + recipe.id}
								className={`RecipeCard ${(counter % 2 === 0) ? "Black" : "White"}`}
								title={recipe.title}
							>
								{(recipe.cuisine) ? <span className="label">{recipe.cuisine}</span> : ""}
								<div className="ImageWrapper">
									<LazyImage alt={recipe.title} src={recipe.photoUrl} />
								</div>
								<div className="Details">
									<div className="Like">
										<input id={`cb_like_${recipe.id}`} type="checkbox" className="cb_like" />
										<label htmlFor={`cb_like_${recipe.id}`} onClick={this.onClick_Like} >
											<img className="UnLikedIMG" alt="" src={Heart}></img>
											<img className="LikedIMG" alt="" src={HeartColored}></img>
										</label>
									</div>
									<div className="Name">
										<span>{recipe.title}</span>
									</div>
									<div className="extras">
										<span className="price">$ {recipe.cost}</span>
										<span className="category">{recipe.category}</span>
									</div>
									<div className="Description">
										<span>{recipe.description}</span>
									</div>
								</div>
								<div className="HoverDetails">
									<div className="Buttons">
										<button	onClick={(event) => this.onClick_ViewMore(event, recipe.id)}>View more</button>
										<button onClick={(event) => this.onClick_QuickView(event, recipe.id)}>Quick View</button>
									</div>
								</div>
								{counter++}
							</div>
						);
					})
				}
			</div>
		);
	};

	get_HighlightedSpan(recipeName, searchQ) {
		const HighlightedSpan = recipeName.toLowerCase().replace(searchQ.toLowerCase(), ("<span class='Highlighter'>" + searchQ + "</span>"));
		return { __html: HighlightedSpan };
	};
}
export default withRouter(Recipes);