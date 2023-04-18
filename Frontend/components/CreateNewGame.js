import { useState } from "react";
import { StyleSheet, View, SafeAreaView, Text,TextInput,} from "react-native";
import Sizedtext from "./SizedText";
import HeaderButton from "./HeaderButton.js";
import SizedButton from "./SizedButton";

const config = require('../config');
const {BACKEND} = config;

export default function CreateNewGame() {
    const [nbJoueur, setNbJoueur] = useState("");
    const [dureeJour, setDureeJour] = useState("");
    const [dureeNuit, setDureeNuit] = useState("");
    const [dateDeb, setDateDeb] = useState("");
    const [HeureDeb, setHeureDeb] = useState("");
    const [MinDeb, setMinDeb] = useState("");
    const [probaPouv, setProbaPouv] = useState("");
    const [probaLoup, setProbaLoup] = useState("");
    
    function calculerNb(text) {
        console.log("text",text);
        let index = 0;
        let number = 0;
        const [ent,dec] = text.replace(",", ".").split(".")
        console.log(dec);
        if (ent) {
            for (letter of ent.split('').reverse().join('')) {
                console.log("letter",letter)
                number += parseInt(letter)*(10**index);
                index += 1;
                }
        }
        index = -1;
        if (dec) {
            for (letter of dec) {
                console.log("letter", letter);
                number += parseInt(letter)*(10**index);
                index -= 1;
            }
        }
        return number;
    }

    function creationPartie() {
        console.log("creation partie")
        const nbJoueurRentree = calculerNb(nbJoueur);
        const dureeJourRentree = calculerNb(dureeJour);
        const dureeNuitRentree = calculerNb(dureeNuit);
        const probaPouvRentree = calculerNb(probaPouv);
        const probaLoupRentree = calculerNb(probaLoup);
        const data = {
            nbJoueur: nbJoueurRentree,
            dureeJour: dureeJourRentree,
            dureeNuit: dureeNuitRentree,
            dateDeb: dateDeb+":"+HeureDeb+":"+MinDeb,
            probaPouv: probaPouvRentree,
            probaLoup: probaLoupRentree
        };
        console.log(data)
        fetch(`${BACKEND}/partie`, {
            method: "POST",
            headers: {"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
            body: "data=" + JSON.stringify(data)
        })
        .then(res=> res.json())
        .then(json => console.log(json))
        .catch(error=>console.log(error));
    }
    return (
        <SafeAreaView style={{ backgroundColor: "white" }}>
        <View style={styles.container}>
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <Text>Nombre de Joueur: </Text>
                <TextInput
                keyboardType="numeric"
                onChangeText={setNbJoueur}
                value={nbJoueur}
                style = {styles.input}/>
            </View>               
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <Text>Durée du jour: </Text>
                <TextInput
                keyboardType="numeric"
                onChangeText={setDureeJour}
                value={dureeJour}
                style = {styles.input}/>
            </View>               
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <Text>Durée de la nuit: </Text>
                <TextInput
                keyboardType="numeric"
                onChangeText={setDureeNuit}
                value={dureeNuit}
                style = {styles.input}/>
            </View>                
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <Text>Date de Début: </Text>
                <TextInput
                onChangeText={setDateDeb}
                value={dateDeb}
                style = {styles.input}/>                
            </View>
            <View>
                <Text>Minute de Début: </Text>
                <TextInput
                onChangeText={setHeureDeb}
                value={HeureDeb}
                style = {styles.input}/>
            </View>
            <View>
                <Text>Minute de Début: </Text>
                <TextInput
                onChangeText={setMinDeb}
                value={MinDeb}
                style = {styles.input}/>
            </View>                
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <Text>Probabilité d'apparition du pouvoir: </Text>
                <TextInput
                keyboardType="decimal-pad"
                onChangeText={setProbaPouv}
                value={probaPouv}
                style = {styles.input}/>
            </View>
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <Text>Probabilité d'apparition des Loups Garou: </Text>
                <TextInput
                keyboardType="decimal-pad"
                onChangeText={setProbaLoup}
                value={probaLoup}
                style = {styles.input}/>
            </View>
            <View
            style={{flex:1, flexDirection: 'row'}}>
                <SizedButton 
                buttonLabel={"Créer Partie"}
                onPress = {() => creationPartie()}
                size = {"xlarge"}
                buttonStyle = {styles.selectionButton}
                buttonLabelStyle = {styles.selectionButtonLabel}
                />
            </View>
        </View>
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    selectionButtonLabel: {
        backgroundColor: "#4f7c7b",
        borderColor: "#000000",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 4,
        textAlign: "center",
      },
      selectionButton: {
        width: "100%",
        color: "#000000",
      },
    input : {
        borderWidth: 1,
        height: 40,
        width: 50,
    },
    container: {
        display: "flex",
        flexDirection: 'column',
        height: "100%"
    },
    header: {
        width: "100%",
        top: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgb(78, 78, 78)",
        padding: 10,
    },
    welcomeText: {
        color: "white",
    },
    disconnectButtonLabel: {
        color: "white",
        backgroundColor: "black",
        borderRadius: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: "white",
    },
});
