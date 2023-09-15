const { User, Book } = require('../models');

// import function for sign a token
const { signToken } = require('../utils/auth');

// import { AuthenticationError } from 'apollo-server-express'; with will be called when
// authentication fails.
const { AuthenticationError } = require('apollo-server-express');


const resolvers = {


  Query: {
    // me will return a query for the current user
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      // throw new AuthenticationError if the user is not logged in
      throw new AuthenticationError('You need to be logged in!');
    }
  },




  Mutation: {
  //    Accepts an email and password as parameters; returns an Auth type.

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },



    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },


    saveBook: async (parent, {book}, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },


    removeBook: async (parent, {bookId}, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
    }

  }
};


//  Export the resolvers to be used in your Apollo Server
module.exports = resolvers;
