const isEmail = (email) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;

	return false;
};

const isEmpty = (string) => {
	if (string.trim() === '') return true;

	return false;
};

exports.validateSignupData = (data) => {
	let errors = {};
	let valid = true;
	let success = 1;

	if (isEmpty(data.fullName)) {
		errors.fullName = "Name must not be empty";
	}
	if (isEmpty(data.email)) {
		errors.email = 'Must not be empty';
	} else if (!isEmail(data.email)) {
		errors.email = 'Must be a valid email address';
	}

	if (isEmpty(data.password)) {
		errors.password = 'Must not be empty';
	} else if (data.password.length < 6) {
		errors.password = "Password should be at least 6 characters"
	}

	if (Object.keys(errors).length !== 0) {
		valid = false;
		success = 0;
	}

	return {
		errors,
		valid,
		success
	};
};

exports.validateLoginData = (data) => {
	let errors = {};
	let valid = true;
	let success = 1;
	if (isEmpty(data.email)) errors.email = 'Must not be empty';
	if (isEmpty(data.password)) {
		errors.password = 'Must not be empty';
	} else if (data.password.length < 6) {
		errors.password = "Password should be at least 6 characters"
	}

	if (Object.keys(errors).length !== 0) {
		valid = false;
		success = 0;
	}

	return {
		errors,
		valid,
		success
	};
};

exports.reduceUserDetails = (data) => {
	let userDetails = {};

	if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
	if (!isEmpty(data.website.trim())) {
		// https://website.com
		if (data.website.trim().substring(0, 4) !== 'http') {
			userDetails.website = `http://${data.website.trim()}`;
		} else {
			userDetails.website = data.website;
		}

		if (userDetails.website.trim().substring(userDetails.website.trim().length, userDetails.website.trim().length - 4) !== ".com") {
			userDetails.website += ".com";
		}

	}
	if (!isEmpty(data.location.trim())) userDetails.location = data.location;

	return userDetails;
};