import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dashboard, StartScreen } from "../screens";
import ProductsScreen from "../screens/ProductsScreen";
import ShoppingListsScreen from "../screens/ShoppingListsScreen";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from "@react-navigation/native";
import { theme } from '../core/theme'
import Logo from "./Logo";
import { Image, StyleSheet } from "react-native";
const Tab = createBottomTabNavigator();

const productsName = 'Products'
const shoppingListsName = 'Shopping List'

const cartIcon = 'cart'
const cartIconOutline = 'cart-outline'
const productsIcon = 'bag'
const productsIconOutline = 'bag-outline'

export default function MyTabs({ userData }) {
    console.log('My Tabs:\n' + userData.id);
    return (
        <Tab.Navigator
            initialRouteName={productsName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let routeName = route.name;


                    if (routeName === productsName) {
                        iconName = focused ? productsIcon : productsIconOutline
                    } else if (routeName === shoppingListsName) {
                        iconName = focused ? cartIcon : cartIconOutline
                    }

                    return <Ionicons name={iconName} size={size} color={color}></Ionicons>
                },
                tabBarActiveTintColor: theme.colors.primary
            })}

        >
            <Tab.Screen name={productsName}>
                {() => <ProductsScreen userData={userData} />}
            </Tab.Screen>
            <Tab.Screen name={shoppingListsName}>
                {() => <ShoppingListsScreen userData={userData} />}
            </Tab.Screen>
        </Tab.Navigator>

    )
}
