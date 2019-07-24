import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import SubmissionForm from './components/SubmissionForm';
import CapturePicture from './components/CapturePicture';

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <SubmissionForm />);
         </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
