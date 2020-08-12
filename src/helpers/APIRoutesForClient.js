const getServerURL = () => {
	let url = "";
	if (window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")) {
		url = "http://localhost:" + 3001;
	} else {
		url = window.location.origin;
	}
	return (url + "/API");
}

const APIRoutesForClient = {
	GetRecipes: `${getServerURL()}/recipe`
};

module.exports = APIRoutesForClient;