import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import i18n from '../i18n';
import { Button } from '../components/common';

import Database from '../db';

class WelcomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.doTest = this.doTest.bind(this);
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.welcomeMessageContainer}>
                    <Text style={styles.welcomeMessage}>
                        {i18n.t('home.welcome', { appName: i18n.t('appName') })} AA BB
            </Text>
                </View>
                <View style={styles.practiceButtonContainer}>
                    <Button
                        //onPress={() => this.props.navigation.navigate('Practice')}
                        onPress={() => this.props.navigation.navigate('Login')} >
                        <Icon name="play" size={22} />
                    </Button>

                    <Button onPress={this.doTest}>
                        <Icon2 name="warning" size={22} />
                    </Button>
                </View>
            </View>
        );
    }

    doTest() {
        var db = new Database();
        db.open().then(async () => {
            try {
                await db.executeSql("INSERT INTO Action(actionId,cattleId,feedId,feedType,quantity,actionTime) VALUES (1, 'cat1','feed1','Food',100,1000);");
            }
            catch (error) {
                console.log('WelcomeScreen.doTest', error);
            }

            try {
                var [results] = await db.executeSql("SELECT * FROM Action;");
                // results.rows.length
                // results.rows.item(i)

                console.log('WelcomeScreen.doTest SELECT results', results);
            }
            catch (error) {
                console.error('WelcomeScreen.doTest', error);
            }

            db.close();
        });
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeMessageContainer: {
        heigh: 50,
        marginTop: 'auto',
        paddingTop: 50,
        alignSelf: 'center',
        width: '95%'
    },
    welcomeMessage: {
        marginBottom: 30,
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    practiceButtonContainer: {
        marginTop: 'auto',
        width: '95%',
        marginBottom: 30
    }
}

export default WelcomeScreen;
