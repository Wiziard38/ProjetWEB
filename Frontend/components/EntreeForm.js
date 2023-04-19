import {View, Text,TextInput,} from "react-native";

export default function EntreeForm({Label, onChange, KeyBoardType, style}) {
    return (
        <View style={{flex:1, flexDirection: 'row'}}>
            <Text>{Label}</Text>
            <TextInput
            keyboardType={KeyBoardType}
            onChangeText={onChange}
            placeholder = {dataName}
            style = {style}/>
        </View>
    );
}