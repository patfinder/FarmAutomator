import { Formik } from 'formik';
import React from 'react';
import { Button, TextInput, View } from 'react-native';
import styles from './styles';

const CapturePicture = () => (
    <View>
        <Button
            title="Capture"
            onPress={handleSubmit}
        />
    </View>
);

export default CapturePicture;
