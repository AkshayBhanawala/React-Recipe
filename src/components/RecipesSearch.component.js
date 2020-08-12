import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Config from '../helpers/Config';
import OverlayRecipeDetails from './_Custom/OverlayRecipeDetails';
import LazyImage from './LazyImage.component';
import Heart from '../assets/Icons/Icon feather-heart.png';
import HeartColored from '../assets/Icons/Icon feather-heart-color.png';
import './Recipes.component.css';

class RecipesSearch extends Component {
	static displayName = 'RecipesSearch';
	_isMounted = false;
	PageLoadingPlaceholder = undefined;

	constructor(props) {
		super(props);

		this.PageLoadingPlaceholder = this.props.PageLoadingPlaceholder;

		this.state = {
			searchQ: "",
			_isFetching: true,
			recipes: undefined,
			RedirectToDetails: undefined,
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

	getRecipes() {
		let redirectBack = true;
		const searchQ = this.props.searchQ || this.props.match.params.searchQ;
		let recipes = localStorage.getItem(Config.LSNames.recipes);

		if (searchQ && recipes) {
			recipes = JSON.parse(recipes);
			recipes = recipes.filter((obj) => obj.name.toLowerCase().includes(searchQ.toLowerCase()));
			if (recipes && recipes.length > 0) {
				redirectBack = false;
				this.setState({
					searchQ: searchQ,
					_isFetching: false,
					recipes: recipes
				});
				return;
			}
		}
		if (redirectBack) {
			this.props.history.goBack();
		}
	}

	onClick_ViewMore(event, id) {
		event.stopPropagation();
		this.props.history.push('/' + id);
	}

	onClick_QuickView(event, id) {
		event.stopPropagation();
		const recipe = this.state.recipes.find((obj) => obj.id === id);
		this.setState({
			ORecipeDetails: {
				show: true,
				recipe: recipe
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
		if (this.state.RedirectToDetails || this.state.RedirectToDetails === 0) {
			return (<Redirect to={"/" + this.state.RedirectToDetails} />);
		}
		if (!this.state.recipes || this.state.recipes.length === 0) {
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
					this.state.recipes.map((recipe) => {
						return (
							<div
								key={'key_' + recipe.id}
								className={`RecipeCard ${(recipe.id % 2 === 0) ? "Black" : "White"}`}
								title={recipe.name}
							>
								{(recipe.label) ? <span className="label">{recipe.label}</span> : ""}
								<div className="ImageWrapper">
									<LazyImage alt={recipe.name} src={recipe.image} />
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
										<span dangerouslySetInnerHTML={this.get_HighlightedSpan(recipe.name, this.state.searchQ)}></span>
									</div>
									<div className="extras">
										<span className="price">$ {recipe.price}</span>
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

export default withRouter(RecipesSearch);