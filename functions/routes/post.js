const { Router } = require('express');
const { db } = require('../firebase');

// setup router api/post
const router = Router();

// Get all post
router.get('/', async (req, res, next) => {
	try {
		const snapchat = await db.collection('post').get();
		let posts = [];
		snapchat.forEach(doc => {
			posts.push({ id: doc.id, ...doc.data() });
		});
		res.status(200).json({ posts });
	} catch (error) {
		next(error)
	}
});

// Get one post
router.get('/:id', async (req, res, next) => {
	try {
		const doc = await db.doc(`post/${req.params.id}`).get();
		if (doc.exists) {
			res.status(200).json(doc.data());
		} else {
			res.status(404).json({
				message: `Post ${req.params.id} not found.`,
				success: 0
			});
		}
	} catch (error) {
		next(error);
	}
});


// Add a post
router.post('/', async (req, res, next) => {
	const body = {
		content: req.body.content,
		type: req.body.type,
		createdAt: new Date().toISOString(),
		file: null,
	};
	try {
		const writeResult = await db.collection('post').add(body);
		res.status(201).json({
			message: `Post created successfully ${writeResult.id}`,
			success: 1
		});
	} catch (error) {
		res.status(500);
		next(error);
	}
});

// Delete a post
router.delete('/:id', async (req, res, next) => {
	try {
		const doc = db.doc(`post/${req.params.id}`);
		if ((await doc.get()).exists) {
			await doc.delete();
			res.status(200).json({
				message: `Post ${doc.id} was successfully deleted.`,
				success: 1
			});
		} else {
			res.status(404).json({
				message: `Post ${req.params.id} not found.`,
				success: 0
			});
		}
	} catch (error) {
		res.status(500);
		next(error);
	}
});

module.exports = router;