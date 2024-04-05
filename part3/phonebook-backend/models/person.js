const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URI

console.log('connecting to MongoDB')
mongoose.connect(url)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = mongoose.Schema({
	name : {
		type : String,
		required : true,
		minLength : 3
	},
	number : {
		type: String,
		validate: {
			validator: function(v) {
				return /(\d{3}-\d+)|(\d{2}-\d+)/.test(v) && v.length > 7
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		required : true
	},
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)