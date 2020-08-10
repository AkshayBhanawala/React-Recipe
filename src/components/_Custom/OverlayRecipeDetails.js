import React, { Component } from 'react';
import HelperMethods from '../../helpers/HelperMethods';
import Config from '../../helpers/Config';
import SVGClose from './SVGClose';
import LazyImage from '../LazyImage.component';
import Heart from '../../assets/Icons/Icon feather-heart.png';
import HeartColored from '../../assets/Icons/Icon feather-heart-color.png';
import './OverlayRecipeDetails.css';

class OverlayRecipeDetails extends Component {
	static displayName = 'OverlayRecipeDetails';

/**==========================
 * props
 * ==========================
 * show
 * 	[true|false]
 *
 *
 * recipe
 *
 *
 * onClose()
 * 	[Event onClose]
 */

	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			reload: false
		};
		this.close = this.close.bind(this)
		this.onClick_Like = this.onClick_Like.bind(this)
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
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

	close() {
		this.setState({
			reload: true
		});
		this.setState({
			reload: false
		});
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	render() {
		if (!this.props.show || !this.props.recipe) {
			return (<React.Fragment></React.Fragment>);
		}
		return this.renderResponse();
	};

	renderResponse() {
		return (
			<div className={`OverlayRecipeDetails`}>
				<div className="OverlayCard">
					<div className="CloseBTN">
						<button onClick={(event) => this.close()}><SVGClose /></button>
					</div>
					<div className="ORecipeCardWrapper">
						<div
							className={`ORecipeCard ${(this.props.recipe.id % 2 === 0) ? "Black" : "White"}`}
							title={this.props.recipe.name}
						>
							<div className="part1">
								{(this.props.recipe.label) ? <span className="label">{this.props.recipe.label}</span> : ""}
								<div className="ImageWrapper">
									<LazyImage alt={this.props.recipe.name} src={this.props.recipe.image} />
								</div>
								<div className="Details">
									<div className="Like">
										<input id={`cb_like_${this.props.recipe.id}`} type="checkbox" className="cb_like" />
										<label htmlFor={`cb_like_${this.props.recipe.id}`} onClick={this.onClick_Like} >
											<img className="UnLikedIMG" alt="" src={Heart}></img>
											<img className="LikedIMG" alt="" src={HeartColored}></img>
										</label>
									</div>
									<div className="extras">
										<span className="price">$ {this.props.recipe.price}</span>
										<span className="category">{this.props.recipe.category}</span>
									</div>
								</div>
							</div>
							<div className="part2">
								<div className="Details">
									<div className="Name">
										<span>{this.props.recipe.name}</span>
									</div>
									<div className="Description">
										<span>{this.props.recipe.description}</span>
									</div>
									<div className="Description2">
										<span>{HelperMethods.get_LoremIpsumText()}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

}

export default OverlayRecipeDetails;