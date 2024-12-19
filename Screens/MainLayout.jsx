import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Home from "./Home";
import Collections from "./Collections";
import Search from "./Search";
import Bookmark from "./Bookmark";
import Profile from "./Profile";

const MainLayout = () => {
  const Tab = createBottomTabNavigator();

  const getTabBarIcon = (routeName, isFocused) => {
    let iconName;
    switch (routeName) {
      case "Home":
        iconName = isFocused ? "home" : "home-outline";
        break;
      case "Search":
        iconName = isFocused ? "search" : "search-outline";
        break;
      case "Collections":
        iconName = isFocused ? "search" : "search-outline";
          break;
      case "Bookmark":
        iconName = isFocused ? "bookmarks" : "bookmarks-outline";
        break;
      case "Settings":
        iconName = isFocused ? "person" : "person-outline";
        break;
      default:
        iconName = "ios-information-circle";
    }
    return <Ionicons name={iconName} size={25} color={'#EEAF0E'} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const routeName = route.name;
          return getTabBarIcon(routeName, focused);
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 56,
          position: "absolute",
          bottom: 24,
          shadowColor:'grey',
          shadowOffset: 3,
          shadowOpacity: .5,
          left: 24,
          backgroundColor: 'black',
          right: 24,
          paddingTop:10,
          paddingBottom:10,
          borderRadius: 16,
          
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Collections"
        component={Collections}
        options={{ headerShown: false }}
      />
       <Tab.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false, tabBarButton: () => null }}
      /> */}
      <Tab.Screen
        name="Bookmark"
        component={Bookmark}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default MainLayout;
