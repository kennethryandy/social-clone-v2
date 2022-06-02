const { admin } = require('../firebase');

module.exports = async (req, res, next) => {

	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
		res.status(403).send('Unauthorized');
		return;
	}

	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		// Read the ID Token from the Authorization header.
		idToken = req.headers.authorization.split('Bearer ')[1];
	} else {
		// No cookie
		res.status(403).send('Unauthorized');
		return;
	}

	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		req.user = decodedIdToken;
		next();
		return;
	} catch (error) {
		res.status(403).send('Unauthorized');
		return;
	}
};
