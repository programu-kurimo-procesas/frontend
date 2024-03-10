import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dashboard, StartScreen } from "../screens";
import ProductsScreen from "../screens/ProductsScreen";
import ShoppingListsScreen from "../screens/ShoppingListsScreen";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from "@react-navigation/native";
import {theme} from '../core/theme'
const Tab = createBottomTabNavigator();

const productsName = 'Products'
const shoppingListsName = 'Shopping Lists'

const cartIcon = 'cart'
const cartIconOutline = 'cart-outline'
const productsIcon = 'bag'
const productsIconOutline = 'bag-outline'

export default function MyTabs() {
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
            <Tab.Screen name={productsName} component={ProductsScreen} />
            <Tab.Screen name={shoppingListsName} component={ShoppingListsScreen} />
        </Tab.Navigator>

    )
}