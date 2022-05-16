const { Schema, model, Types: { ObjectId } } = require('mongoose');


const URL_PATTERN = /^https?:\/\/(.+)/;


const postSchema = new Schema({
	headline: {type: String, minlength: [4, 'Headline must be at least 4 characters'], required: [true, 'Headline is required']},
	location: {type: String, minlength: [8, 'Location must be at least 8 characters'], required: [true, 'Location is required']},
	companyName: {type: String, minlength: [3, 'Company name must be at least 3 characters'], required: [true, 'Company name is required']},
	companyDescription: {type: String, maxlength: [40, 'Description must be less than 40 characters'],required: [true, 'Company description is required']},
	author: {type: ObjectId, required: true },
	usersApplied: {type: [ObjectId], ref: 'User', default:[]}
})



//TODO add validation
// const tripSchema = new Schema({
// 	startPoint: { type: String, minlength: [4, 'Starting point must be at least 4 characters'] },
// 	endPoint: { type: String, minlength: [4, 'Ending point must be at least 4 characters'] },
// 	date: { type: String, required: true },
// 	time: { type: String, required: true },
// 	carImage: { type: String, validate: {
//         validator(value){
//            return URL_PATTERN.test(value);
//         },
//         message: 'Image must be a valid URL'
//     }
// },
// 	carBrand: { type: String,minlength: [4, 'CarBrand point must be at least 4 characters'] },
// 	seats: {
// 		type: Number, min: [0, 'Seats must be between 0 and 4'],
// 		max: [4, 'Seats must be between 0 and 4']
// 	},
// 	price: { type: Number, min: 1 , max: 50 },
// 	description: { type: String, minlength: [4, 'Description must be at least 10 characters'] },
// 	owner: { type: ObjectId, ref: 'User', required: true },
// 	buddies: { type: [ObjectId], ref: 'User', default: [] }
// });


const Post = model('Post', postSchema);

module.exports = Post;