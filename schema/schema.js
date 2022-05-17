const graphql = require("graphql");
//use lodash to find data
const _ = require("lodash");
const Book = require("../models/bookModels")
const Author = require("../models/authorModels")


//grab the graphqlobjecttype from graphql nd destructure it
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return Author.findById(parent.authorId)
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({authorId: parent.id})
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
       return Book.findById(args.id)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id)
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
       return Book.find({})
      },
    },

    authors: { 
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
       return Author.find({})
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  //the fields allows us make different queries to our db e.g add or delete author
  fields: { 
    addAuthor: {
      type:AuthorType,
      args: { 
        name:{type:new GraphQLNonNull(GraphQLString)},
        age:{type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        //save the author in the database
       return author.save()
      }
    },
    addBook : { 
      type: BookType,
      args: { 
        name:{ type: new GraphQLNonNull(GraphQLString)},
        genre:{ type: new GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLID}
      },
      resolve(parent, args) {
        let books = new Book ({
          name: args.name,
        genre:args.genre,
        authorId:args.authorId
        })
        return books.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
