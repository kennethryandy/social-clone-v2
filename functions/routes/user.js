const { Router } = require('express');
const { db } = require('../firebase');
const { validateLoginData, validateSignupData, reduceUserDetails } = require('../utils/validators');
const isAuth = require('../middlewares/authMiddleware');
const axios = require('axios');

const router = Router();

// Get all users
router.get('/', async (req, res, next) => {
	try {
		const snapshot = await db.collection('user').get();
		let users = [];
		if (!snapshot.empty) {
			snapshot.forEach((doc) => {
				users.push(doc.data());
			});
		}
		return res.status(200).json({
			success: 1,
			users
		});
	} catch (error) {
		next(error);
	}
});

// Get one user
router.get('/:id', async (req, res, next) => {
	try {
		const user = await db.doc(`user/${req.params.id}`).get();
		if (user.exists) {
			return res.status(200).json({
				success: 1,
				user: user.data()
			});
		}
		return res.status(404).json({
			message: "User not found0",
			success: 0
		});
	} catch (error) {

	}
});


// Update user
router.put('/', isAuth, async (req, res, next) => {
	const userDetails = reduceUserDetails(req.body);
	try {
		const userRef = db.collection('user').doc(req.user.user_id);
		await userRef.update(userDetails);
		const updatedUser = await userRef.get();
		res.status(200).json({
			success: 1,
			updatedUser: updatedUser.data()
		});
	} catch (error) {
		next(error);
	}
});


// Auth routes
router.post('/signup', async (req, res, next) => {
	const newUser = {
		email: req.body.email,
		fullName: req.body.fullName,
		createdAt: new Date().toISOString()
	};
	const { valid, errors } = validateSignupData({
		...newUser,
		password: req.body.password
	});
	if (!valid) {
		return res.status(401).json(errors);
	}
	try {
		const result = await axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.API_KEY}`,
			{
				email: req.body.email,
				password: req.body.password,
				returnSecureToken: true
			}
		);
		if (result.data) {
			db.doc(`user/${result.data.localId}`).set({
				...newUser,
				userId: result.data.localId
			});
			return res.status(201).json({
				message: "User created successfully",
				token: result.data.idToken,
				success: 1
			});
		}
	} catch (error) {
		if (error.response) {
			return res.status(400).json({
				success: 0,
				message: error.response.data.error.message === "EMAIL_EXISTS" ? "User already exists" : error.response.data.error.message
			});
		}
		next(error);
	}
});

router.post('/login', async (req, res, next) => {
	const { valid, errors } = validateLoginData({
		email: req.body.email,
		password: req.body.password
	});
	if (!valid) {
		return res.status(401).json(errors);
	}
	try {
		const result = await axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.API_KEY}`,
			{
				email: req.body.email,
				password: req.body.password,
				returnSecureToken: true
			}
		);
		if (result.data) {
			return res.status(200).json({
				message: "Logged in successfully",
				success: 1,
				token: result.data.idToken
			});
		}
	} catch (error) {
		next(error);
	}
});

module.exports = router;