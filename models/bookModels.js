const mongoose =require('mongoose')
const Schema = mongoose.Schema

//create the book schema

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
})

module.exports = mongoose.model('Book', bookSchema)