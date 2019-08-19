import React from 'react';
import { Text } from 'react-native';
import {
    createSwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator,
    createAppContainer
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './src/reducers';

import i18n from './src/i18n';

import LoginScreen from './src/screens/LoginScreen';
import ActionScreen from './src/screens/ActionScreen';

import ScanQRScreen from './src/screens/ScanQRScreen';
import CaptureScreen from './src/screens/CaptureScreen';

import WelcomeScreen from './src/screens/WelcomeScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HighScoresScreen from './src/screens/HighScoresScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';
import ActionDetailsScreen from './src/screens/ActionDetailsScreen';
import TestScreen from './src/screens/TestScreen';

const ActionNavigator = createStackNavigator({
    Action: ActionScreen,
    ActionDetails: ActionDetailsScreen,
    ScanQr: ScanQRScreen,
    TakePicture: CaptureScreen,
});

const HomeNavigator = createSwitchNavigator({

    // TODO: remove below line
    //TestScreen: TestScreen,

    Welcome: WelcomeScreen,
    Login: LoginScreen,
    Action: ActionNavigator,


    Practice: PracticeScreen,
    Results: ResultsScreen
});

/* eslint-disable react/display-name */

const AppNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: HomeNavigator, // HomeNavigator
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 10, color: tintColor }}>
                        {i18n.t('navigation.home')}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) => (<Icon name="home" size={horizontal ? 20 : 25} color={tintColor} />)
            }
        },
        HighScores: {
            screen: HighScoresScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 10, color: tintColor }}>
                        {i18n.t('navigation.highScores')}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="chart-bar" size={horizontal ? 20 : 25} color={tintColor} />
            }
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarLabel: ({ tintColor }) => (
                    <Text style={{ fontSize: 10, color: tintColor }}>
                        {i18n.t('navigation.settings')}
                    </Text>
                ),
                tabBarIcon: ({ horizontal, tintColor }) =>
                    <Icon name="cogs" size={horizontal ? 20 : 25} color={tintColor} />
            }
        }
    },
    {
        tabBarOptions: {
            activeTintColor: 'orange',
            inactiveTintColor: 'gray'
        }
    }
);

/* eslint-enable react/display-name */

const InitialNavigator = createSwitchNavigator({
    Splash: SplashScreen,
    App: AppNavigator
});

const AppContainer = createAppContainer(InitialNavigator);

class App extends React.Component {
    render() {
        return (
            <Provider store={createStore(reducers)}>
                <AppContainer />
            </Provider>
        );
    }
}

export default App;
