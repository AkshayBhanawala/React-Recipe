const HelperMethods = {
	get_LoremIpsumText() {
		return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim neque volutpat ac tincidunt. Est velit egestas dui id ornare arcu. Non blandit massa enim nec dui. Fermentum dui faucibus in ornare quam viverra orci sagittis. Nam aliquam sem et tortor consequat. Interdum varius sit amet mattis vulputate enim nulla aliquet. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Sociis natoque penatibus et magnis dis. Facilisi cras fermentum odio eu. Aliquam vestibulum morbi blandit cursus. Sagittis eu volutpat odio facilisis mauris sit. Odio ut enim blandit volutpat maecenas. Egestas congue quisque egestas diam. Tempor nec feugiat nisl pretium fusce id velit. Pellentesque id nibh tortor id aliquet lectus."
	},
	get_RandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
};

export default HelperMethods;