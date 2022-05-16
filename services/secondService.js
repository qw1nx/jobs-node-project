const { findByIdAndDelete } = require('../models/Post');
const Post = require('../models/Post');
const mapErrors = require('../util/mappers');

//TODO Modify accordingly
async function createPost(post) {
	const result = new Post(post);
	await result.save();

	return result;
}


async function getPostsByUser(userId) {
	return Post.find({}).lean();
}

async function getPosts() {
	return Post.find({}).lean();
}

async function getPostAndUsers(id) {

	return Post.findById(id).populate('owner').populate('buddies').lean();
}

async function getPostById(id) {
	return Post.findById(id).lean();
}

async function updatePost(id, post) {
		const existing = await Post.findById(id);

		existing.headline = post.headline;
		existing.location = post.location;
		existing.companyName = post.companyName;
		existing.companyDescription = post.companyDescription;

		await existing.save();
}

async function deleteById(id){
	await Post.findByIdAndDelete(id);
}

async function applyForPost(postId, userId){

		const post = await Post.findById(postId);

		if(post.usersApplied.includes(userId)){
			console.log(post);
			throw new Error('User is already part of the post');
		}

		post.usersApplied.push(userId);
		console.log(post);
		await post.save();
}



module.exports = {
	createPost,
	getPosts,
	getPostById,
	getPostAndUsers,
	updatePost,
	deleteById,
	applyForPost,
	getPostsByUser
};