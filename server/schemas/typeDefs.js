const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book] 
  }

  type Book {
    _id: ID
    bookId: id
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }


  type Query {
    me: User
  }
  
  type Auth {
    token: ID!
    user: User
  }



  input SaveBook {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
 
    
  }
  
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: SavedBookInput): User
        removeBook(bookId: String!): User
  }
`;


// Export the typeDefs to be used in the server setup
module.exports = typeDefs;
