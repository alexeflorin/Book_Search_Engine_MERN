import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//  Create an Apollo Provider to make every request work with the Apollo server. - App.js
import { ApolloProvider,} from '@apollo/react-hooks';


const client = new ApolloProvider(
    {
        request: (operation) => {
            const token = localStorage.getItem('id_token');
            operation.setContext({
                headers: {
                    authorization: token ? `Bearer ${token}` : '',
                },
              uri: 'http://localhost:4000/graphql',

            });
        }
    }
);
function App() {
  return (
      // Create an Apollo Provider to make every request work with the Apollo server.
      <ApolloProvider client={client}>
        <Router>
        <>
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
        </Routes>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;

