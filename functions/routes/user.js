const { Router } = require('express');
const { db } = require('../firebase');
const { validateLoginData, validateSignupData } = require('../utils/validators');
const axios = require('axios');

const router = Router();

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
			db.doc(`user/${result.data.localId}`).set(newUser);
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