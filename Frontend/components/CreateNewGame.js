import { useState } from "react";
import { StyleSheet, View, SafeAreaView, Text,TextInput, Modal, Pressable} from "react-native";
import Sizedtext from "./SizedText";
import HeaderButton from "./HeaderButton.js";
import SizedButton from "./SizedButton";
import EntreeForm from "./EntreeForm";

const config = require('../config');
const {BACKEND} = config;

export default function CreateNewGame() {
    const [nbJoueur, setNbJoueur] = useState("");
    const [dureeJour, setDureeJour] = useState("");
    const [dureeNuit, setDureeNuit] = useState("");
    const [dateDebJour, setDateDebJour] = useState("");
    const [dateDebMois, setDateMois] = useState("");
    const [dateDebAnnee, setDateDebAnnee] = useState("");
    const [HeureDeb, setHeureDeb] = useState("");
    const [MinDeb, setMinDeb] = useState("");
    const [probaPouv, setProbaPouv] = useState("");
    const [probaLoup, setProbaLoup] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [textError, setTextError] = useState("");

    function verificationDonnee() {
        console.log(parseInt(nbJoueur))
        if (parseInt(nbJoueur)<= 4 || parseInt(nbJoueur) >20 || nbJoueur.replace(",",".").indexOf(".") != -1) {
            setTextError("Le nombre de joueur doit être un entier compris entre 1 et 25");
            setModalVisible(true)
            return false;
        }
        if (dureeJour.replace(",",".").indexOf(".") != -1) {
            setTextError("La durée du jour ne doît pas être nulle et dépasser 23h");
            setModalVisible(true)
            return false;
        }
        if (dureeNuit.replace(",",".").indexOf(".") != -1) {
            setTextError("La durée de la nuit ne doît pas être nulle et dépasser 23h");
            setModalVisible(true)
            return false;
        }
        if (parseInt(dateDebAnnee)< 2023 || dateDebAnnee.replace(",",".").indexOf(".") != -1) {
            setTextError("L'année de début rentrée est incorect");
            setModalVisible(true)
            return false;
        }
        if (parseInt(dateDebMois)<= 1 || parseInt(nbJoueur) >12 || dateDebMois.replace(",",".").indexOf(".") != -1) {
            setTextError("Le mois de début rentrée doît être un entier compris entre 1 et 12");
            setModalVisible(true)
            return false;
        }
        if (parseInt(dateDebJour)<= 0 || parseInt(dateDebJour) >25 || dateDebJour.replace(",",".").indexOf(".") != -1){
            setTextError("Le jour de début rentrée doît être un entier compris entre 1 et 31");
            setModalVisible(true)
            return false;
        }
        if (parseInt(HeureDeb)< 0 || parseInt(HeureDeb) >24 || HeureDeb.replace(",",".").indexOf(".") != -1) {
            setTextError("L'heure de début doît être un entier entre 0 et 23");
            setModalVisible(true)
            return false;
        }
        if (parseInt(MinDeb)< 0 || parseInt(MinDeb) >59 || MinDeb.replace(",",".").indexOf(".") != -1) {
            setTextError("Les minutes de début doît être un entier entre 0 et 59");
            setModalVisible(true)
            return false;
        }
        if (parseFloat(probaLoup)< 0 || parseFloat(probaLoup) >1) {
            setTextError("La proba d'apparition des loups garoux doît être un nombre flottant compris entre 0 et 1");
            setModalVisible(true)
            return false;
        }
        if (parseFloat(probaPouv)< 0 || parseFloat(probaPouv) >1 || probaPouv) {
            setTextError("La proba d'apparition des pouvoir doît être un nombre flottant compris entre 0 et 1");
            setModalVisible(true)
            return false;
        }
        return true;
    };

    function creationPartie() {
        console.log("creation partie")
        if (verificationDonnee()) {
            const data = {
                nbJoueur: parseInt(nbJoueur),
                dureeJour: parseInt(dureeJour),
                dureeNuit: parseInt(dureeNuit),
                dateDebJour: parseInt(dateDebJour),
                dateDebMois: parseInt(dateDebMois),
                dateDebAnnee: parseInt(dateDebAnnee),
                MinDeb: parseInt(MinDeb),
                HeureDeb: parseInt(HeureDeb),
                probaPouv: parseFloat(probaPouv),
                probaLoup: parseFloat(probaLoup),
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
        else {

        }
        
    }
    
    return (
        <SafeAreaView style={{ backgroundColor: "white" }}>
            <View style={styles.container}>
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{textError}</Text>
                            <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Fermer</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <EntreeForm
                    Label={"Nombre de joueurs: "}
                    KeyBoardType={"numeric"}
                    onChange={setNbJoueur}
                    style={styles.input}
                    dataName={""}
                />
                <EntreeForm
                    Label={"Durée du jour: "}
                    KeyBoardType={"numeric"}
                    onChange={setDureeJour}
                    style={styles.input}
                    dataName={""}
                />
                <EntreeForm
                    Label={"Durée de la nuit: "}
                    KeyBoardType={"numeric"}
                    onChange={setDureeNuit}
                    style={styles.input}
                    dataName={""}
                />
                <View style={{flex:1, flexDirection: 'row'}}>
                    <Text>Date de début: </Text>
                    <EntreeForm
                        Label={""}
                        KeyBoardType={"numeric"}
                        onChange={setDateDebJour}
                        style={styles.input}
                        dataName={"JJ"}
                    />
                    <Text> / </Text>
                    <EntreeForm
                        Label={""}
                        KeyBoardType={"numeric"}
                        onChange={setDateMois}
                        style={styles.input}
                        dataName={"MM"}
                    />
                    <Text> / </Text>
                    <EntreeForm
                        Label={""}
                        KeyBoardType={"numeric"}
                        onChange={setDateDebAnnee}
                        style={styles.input}
                        dataName={"AAAA"}
                    />
                    <Text> : </Text>
                    <EntreeForm
                        Label={""}
                        KeyBoardType={"numeric"}
                        onChange={setHeureDeb}
                        style={styles.input}
                        dataName={"Heures"}
                    />
                    <Text> : </Text>
                    <EntreeForm
                        Label={""}
                        KeyBoardType={"numeric"}
                        onChange={setMinDeb}
                        style={styles.input}
                        dataName={"Mins"}
                    />
                </View>
                <EntreeForm
                    Label={"Probabilité d'apparition des pouvoirs: "}
                    KeyBoardType={"numeric"}
                    onChange={setProbaPouv}
                    style={styles.input}
                />
                <EntreeForm
                    Label={"Probabilité d'apparition des loups: "}
                    KeyBoardType={"numeric"}
                    onChange={setProbaLoup}
                    style={styles.input}
                />
                <View style={{flex:1, flexDirection: 'row'}}>
                    <SizedButton
                    buttonLabel={"Créer la partie"}
                    onPress={() => creationPartie()}
                    size={"small"}
                    buttonLabelStyle={styles.selectionButton}
                    buttonStyle={styles.selectionButtonLabel}
                    />
                </View>
                
            </View>
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
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
        textAlign: "center",
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
