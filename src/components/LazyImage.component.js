import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import SVGLoading from './_Custom/SVGLoading'

const ImageWrapper = styled.div`
  position: relative;
	height: 100%;
	.lazyload-wrapper {
		height: 100%;
	}
`;

const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
	background-color: rgba(240, 240, 240);
	svg {
		display: block;
		width: 60%;
		margin: auto;
	}
`;

const StyledImage = styled.img`
	display: block;
	height: 100%;
	margin: auto;
`;

const LazyImage = ({ src, alt }) => {
	const refPlaceholder = React.useRef();

	const removePlaceholder = () => {
		refPlaceholder.current.remove();
	};

	return (
		<ImageWrapper>
			<Placeholder ref={refPlaceholder}><SVGLoading /></Placeholder>
			<LazyLoad>
				<StyledImage
					onLoad={removePlaceholder}
					onError={removePlaceholder}
					src={src}
					alt={alt}
				/>
			</LazyLoad>
		</ImageWrapper>
	);
};

LazyImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired
};

export default LazyImage;