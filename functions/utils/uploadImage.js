const busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { v4: uuid } = require('uuid');

module.exports = (req) => {

	const bb = busboy({ headers: req.headers });
	let imageToBeUploaded = {};
	let imageFileName;
	let error = "";

	bb.on("file", (name, file, info) => {
		const { filename, mimeType } = info;
		if (name === "image" && (mimeType !== "image/jpeg" || mimeType !== "image/png")) {
			const imageExtension = filename.split(".")[filename.split(".").length - 1];
			imageFileName = `${uuid()}-${req.user.user_id}.${imageExtension}`;
			const filepath = path.join(os.tmpdir(), imageFileName);
			imageToBeUploaded = { filepath, mimeType };
			file.pipe(fs.createWriteStream(filepath));
		} else {
			error = "Invalid image";
		}
	});
	bb.end(req.rawBody);
	return { imageFileName, imageToBeUploaded, error };
}

// match /{document=**} {
// 	allow read, write: if
// 			request.time < timestamp.date(2022, 7, 2);
// }

// match /post/{postId} {
// 	allow read;
// 	allow write: if isSignedIn();
// }

// match /user/{userId} {
// 	allow read: if isSignedIn();
// 	allow create;
// 	allow delete: if isSignedIn();
// 	allow update: if isSignedIn();
// }

// // Functions
// function isSignedIn() {
// 	return request.auth != null;
// }