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

	if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

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

