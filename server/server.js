//  import dependencies

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');

// database configuration settings
const db = require('./config/connection');

// use environment defined PORT or 3001 PORT if not defined
const PORT = process.env.PORT || 3001;
// initialize Express.js server
const app = express();


// Implement the Apollo Server and apply it to the Express server as middleware.

//  create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs, // GraphQL schema configuration to use
  resolvers, // Resolver functions to handle GraphQL queries
  context: authMiddleware, // function to authenticate user
});

// apply Apollo middleware to the Express server
server.applyMiddleware({ app });

// express middleware for parsing application/json/body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer();
