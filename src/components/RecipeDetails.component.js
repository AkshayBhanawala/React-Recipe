import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import HelperMethods from '../helpers/HelperMethods';
import Config from '../helpers/Config';
import LazyImage from './LazyImage.component';
import Heart from '../assets/Icons/Icon feather-heart.png';
import HeartColored from '../assets/Icons/Icon feather-heart-color.png';
import PlayCircle from '../assets/Icons/Icon ionic-ios-play-circle.png';
import './RecipeDetails.component.css';

class RecipeDetails extends Component {
	static displayName = 'RecipeDetails';

	_isMounted = false;
	PageLoadingPlaceholder = undefined;
	PageLoaderFunction = () => { };

	constructor(props) {
		super(props);

		this.PageLoadingPlaceholder = this.props.PageLoadingPlaceholder;
		this.PageLoaderFunction = this.props.PageLoaderFunction;

		this.state = {
			_isFetching: true,
			recipe: undefined,
		};

		this.onClick_Back = this.onClick_Back.bind(this)
		this.onClick_Like = this.onClick_Like.bind(this)
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		this.getRecipeData();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	getRecipeData() {
		let redirectBack = true;
		const { id } = this.props.match.params;
		let recipes = localStorage.getItem(Config.LSNames.recipes);
		if (id && recipes) {
			recipes = JSON.parse(recipes);
			let recipe = recipes.find((obj) => obj.id === parseInt(id) );
			if (recipe) {
				redirectBack = false;
				this.setState({
					_isFetching: false,
					recipe: recipe
				});
				document.title = recipe.name;
				return;
			}
		}
		if (redirectBack) {
			this.props.history.goBack();
		}
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

	onClick_Back() {
		this.props.history.goBack();
	}

	render() {
		this.render_PageLoader();
		if (this.state._isFetching) {
			return (<></>);
		}
		return this.renderResponse();
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

	renderResponse() {
		return (
			<div className="PageWrapper">
				<div className="BackBTN">
					<button onClick={(event) => this.onClick_Back()}><div className="arrow">➜</div><span className="text"> Go Back</span></button>
				</div>
				<div className="RecipeDetailsWrapper">
					<div
						className="RecipeDetails"
						title={this.state.recipe.name}
					>
						<div className="part1">
							<div className="ImageWrapper">
								<div className="ImagePlayCover"><img alt="Play" src={PlayCircle}/><span className="Title">Play Video</span></div>
								<LazyImage alt={this.state.recipe.name} src={this.state.recipe.image} />
							</div>
							<div className="Ingredients">
								<span className="title">Ingredients :</span>
								<span className="content">{HelperMethods.get_LoremIpsumText()}</span>
							</div>
							<div className="Preparation">
								<span className="title">How to prepare :</span>
								<span className="content">{HelperMethods.get_LoremIpsumText()}</span>
							</div>
						</div>
						<div className="part2">
							<div className="Details">
								<div className="Name">
									<span>{this.state.recipe.name}</span>
								</div>
								<div className="Description">
									<span>{this.state.recipe.description}</span>
								</div>
								<div className="Description2">
									<span>{HelperMethods.get_LoremIpsumText()}</span>
								</div>
								<div className="Extras">
									<div className="Ingredients"><span className="Value">{HelperMethods.get_RandomInteger(1, 10)}</span><span className="Text">ingredients</span></div>
									<div className="Price"><span className="Value">{HelperMethods.get_RandomInteger(100, 500)}</span><span className="Text">bucks</span></div>
									<div className="Time"><span className="Value">{HelperMethods.get_RandomInteger(10, 120)}</span><span className="Text">minutes</span></div>
								</div>
							</div>
							<div className="Favourite">
								<span className="Text">Favourite this recipe</span>
								<div className="Like">
									<input id={`cb_like_${this.state.recipe.id}`} type="checkbox" className="cb_like" />
									<label htmlFor={`cb_like_${this.state.recipe.id}`} onClick={this.onClick_Like} >
										<img className="UnLikedIMG" alt="" src={Heart}></img>
										<img className="LikedIMG" alt="" src={HeartColored}></img>
									</label>
								</div>
							</div>
							<hr />
							<div className="Comment">
								<div className="Title">Add Comments</div>
								<div className="CommentBox"><textarea placeholder="Type something here..."></textarea></div>
								<div className="Buttons"><button>Add Comment</button></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

}

export default withRouter(RecipeDetails);