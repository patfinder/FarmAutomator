import React from 'react';
import { TextInput } from 'react-native';

class QuantityInput extends React.PureComponent {

    constructor(props) {
        super(props);

        this.onQuantityChange = this.onQuantityChange.bind(this);
    }

    render() {
        return (
            <TextInput
                {...this.props}
                value={this.props.value}
                onChangeText={this.onQuantityChange}
            />
        );
    }

    onQuantityChange(val) {
        if (!isNaN(val)) this.props.onQuantityChange(val);
    }
}

export default QuantityInput;
