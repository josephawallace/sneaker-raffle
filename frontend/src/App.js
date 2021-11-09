import './App.css';
import loadingAnimation from './static/images/sneaker-loading.gif';

import Header from './components/Header';
import ProductDetails from './components/ProductDetails';
import Footer from './components/Footer';

import { Container, Grid } from '@mui/material';
import React from 'react';


function App() {
  return (
    <div className="App">
      <Header />
      <Container className="main" maxWidth='lg'>
        <Grid container justifyContent='center' alignItems='center' spacing={2}>
          <Grid item lg={6}>
            <ProductDetails />
          </Grid>
        </Grid>
      </Container >
      <Footer />
    </div>
  );
}

export default App;
