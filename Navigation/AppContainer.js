import * as React from 'react';
import { View, Text } from 'react-native';
import Maps from '../Screens/Maps'
import Detail from '../Screens/Detail'
import { NavigationContainer, CommonActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Icon } from 'react-native-elements'

const Stack = createStackNavigator();

const theme = {
    colors: {
        primary: "#fff",
        background: "#D50320",
        text: "#fff",
        border: "#D50320",
    }
}

function App() {
    return (
        <NavigationContainer
            theme={theme}
        >
            <Stack.Navigator

                initialRouteName="Maps"
                screenOptions={{
                    headerTitle: 'LOGO',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        alignSelf: 'flex-end'
                    },
                    headerLeft: () =>
                        <Icon
                            type="entypo"
                            name="menu"
                            color="#fff"
                            size={20}
                            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
                            iconStyle={{
                                marginLeft: 10
                            }}
                            underlayColor="transparent"
                            onPress={() => { console.log('hey') }}
                        />
                }}
            >
                <Stack.Screen
                    name="Maps"
                    component={Maps}
                    options={Maps.setOptions}
                />
                <Stack.Screen
                    name="Detail"
                    component={Detail}
                    options={{
                        headerRight: () => null,
                        headerLeft: () =>
                            <Icon
                                name="ios-arrow-back"
                                type="ionicon"
                                color="#fff"
                                size={20}
                                iconStyle={{
                                    marginLeft: 10,
                                }}
                            />
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer >
    );
}

export default App;