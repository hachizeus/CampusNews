// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/Login';
import NotFound from './app/+not-found';
import Home from './app/Home';
import SignUp from './app/SignUp';
import Profile from './app/Profile';
import index from './app/index';
import ManageUsers from './app/ManageUsers';
import ManageNews from './app/ManageNews';
import AdminHome from './app/AdminHome';
import PostScreen from './app/PostScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
   
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="index"
            component={index}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="NotFound"
            component={NotFound} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="CreatePost" 
          component={CreatePost} 
          options={{ headerShown: false }}  />
        </Stack.Navigator>
        <Stack.Screen name="AdminHome" component={AdminHome} options={{ headerShown: false }}/>
        <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ headerShown: false }}/>
        <Stack.Screen name="ManageNews" component={ManageNews} options={{ headerShown: false }}/>
        <Stack.Screen name="PostScreen" component={PostScreen} options={{ headerShown: false }}/>
      </NavigationContainer>
     
  );
};

export default App;
