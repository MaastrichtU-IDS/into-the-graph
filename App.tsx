import React from "react";
import { View } from "react-native";
import { Router, Route } from "./react-router";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import './App.css';
import NavBar from "./src/NavBar";
import Footer from "./src/Footer";
import Homepage from "./src/homepage";
import Describe from "./src/describe";

// import blue from '@material-ui/core/colors/blue';

// Change theme color and typography here
const theme = createMuiTheme({
  palette: {
    primary: { light: '#63a4ff', main: '#1976d2', dark: '#004ba0' },
    secondary: { light: '#4caf50', main: '#087f23', dark: '#00600f' },
    // main: blue[700]
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    // red: { light: '#f05545', main: '#b71c1c', dark: '#7f0000' },
    // default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Arial\"",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
    // "fontSize": 13
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Router basename="/into-the-graph/">
      <View style={{height: '100%', backgroundColor: '#eceff1'}}>
        <NavBar />

        <Route exact path="/" component={Homepage} />
        <Route path="/describe" component={Describe} />

        <Footer />
      </View>
    </Router>
  </MuiThemeProvider>
);
export default App;
