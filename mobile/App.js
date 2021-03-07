import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Menu } from "./pages/Menu";
import { Search } from "./pages/Search";
import { Upload } from "./pages/Upload";
import { SearchResults } from "./pages/SearchResults";
import { Report } from "./pages/Report";


const Stack = createStackNavigator();

// NOTE Use command "expo r -c" to run
export default function App() {
  return (
      <NavigationContainer initialRouteName="Login" headerMode="none">
        <Stack.Navigator>
            <Stack.Screen name="Login" component={ Login } options={ { headerShown: false } } />
            <Stack.Screen name="Report" component={ Report } options={ { headerShown: false } } />
            <Stack.Screen name="Signup" component={ Signup } options={ { headerShown: false } } />
            <Stack.Screen name="Menu" component={ Menu } options={ { headerShown: false } } />
            <Stack.Screen name="Search" component={ Search } options={ { headerShown: false } } />
            <Stack.Screen name="Upload" component={ Upload } options={ { headerShown: false } } />
            <Stack.Screen name="SearchResults" component={ SearchResults } options={ { headerShown: false } } />
        </Stack.Navigator>
      </NavigationContainer>
  );
}