import { useState, React } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { fetchData } from "../utils/fetchData";
import SizedButton from "./SizedButton";
import BarScrollInt from "./BarScrollInt";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateNewGame({ onDisconnect }) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [horraire, setHorraire] = useState("heure:mins");
  const [text, setText] = useState("JJ/MM/AAAA");

  const [dureeJour, setDureeJour] = useState(new Date());
  const [dureeNuit, setDureeNuit] = useState(new Date());
  const [showDureeJour, setShowDureeJour] = useState(false);
  const [showDureeNuit, setShowDureeNuit] = useState(false);
  const [TextDureeJour, setTextDureeJour] = useState("Heures:mins");
  const [TextDureeNuit, setTextDureeNuit] = useState("Heures:mins");

  const [nbJoueur, setNbJoueur] = useState("5");
  const [probaPouv, setProbaPouv] = useState("0");
  const [probaLoup, setProbaLoup] = useState("0.3");
  const [modalVisible, setModalVisible] = useState(false);
  const [textError, setTextError] = useState("");

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    const fDate =
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear();
    const fTime =
      currentDate.getHours() + "h" + currentDate.getMinutes() + "mins";
    setText(fDate);
    setHorraire(fTime);
    console.log(fDate + "(" + fTime + ")");
  };

  const onChangeDureeJour = (event, selectedDate) => {
    console.log("dureeJour");
    setShowDureeJour(Platform.OS === "ios");
    setDureeJour(selectedDate);
    const fTime =
      selectedDate.getHours() + "h" + selectedDate.getMinutes() + "mins";
    setTextDureeJour(fTime);
    console.log(fTime);
  };

  const onChangeDurerNuit = (event, selectedDate) => {
    console.log("dureeNuit");
    setShowDureeNuit(Platform.OS === "ios");
    setDureeNuit(selectedDate);
    const fTime =
      selectedDate.getHours() + "h" + selectedDate.getMinutes() + "mins";
    setTextDureeNuit(fTime);
    console.log(fTime);
  };

  function verificationDonnee() { // eslint-disable-line no-unused-vars
    if (nbJoueur.replace(",", ".").indexOf(".") !== -1) {
      setTextError(
        "Le nombre de joueur doit être un entier compris entre 1 et 25"
      );
      setModalVisible(true);
      return false;
    }
    const dateAct = new Date();
    if (
      date.getFullYear < dateAct.getFullYear ||
      (date.getFullYear === dateAct.getFullYear &&
        date.getMonth() < dateAct.getMonth()) ||
      (date.getFullYear === dateAct.getFullYear &&
        date.getMonth() === dateAct.getMonth() &&
        date.getDay() < dateAct.getDay())
    ) {
      setTextError(
        "La date rentrée est incorect, on ne peut pas commencer une partie à une date déjà passée!!"
      );
      setModalVisible(true);
      return false;
    }
    if (
      date.getHours() < dateAct.getHours() ||
      (date.getHours() === dateAct.getHours() &&
        date.getMinutes() < dateAct.getMinutes())
    ) {
      setTextError(
        "La date rentrée est incorect, on ne peut pas commencer une partie à une date déjà passée!!"
      );
      setModalVisible(true);
      return false;
    }
    if (parseFloat(probaLoup) < 0 || parseFloat(probaLoup) > 1) {
      setTextError(
        "La proba d'apparition des loups garoux doît être un nombre flottant compris entre 0 et 1"
      );
      setModalVisible(true);
      return false;
    }
    if (parseFloat(probaPouv) < 0 || parseFloat(probaPouv) > 1) {
      setTextError(
        "La proba d'apparition des pouvoir doît être un nombre flottant compris entre 0 et 1"
      );
      setModalVisible(true);
      return false;
    }
    return true;
  }

  function creationPartie() {
    console.log("creation partie");
    // if (verificationDonnee()) {
    const data = {
      nbJoueur: parseInt(nbJoueur),
      dureeJour: dureeJour.getHours() * 3600 + dureeJour.getMinutes() * 60,
      dureeNuit: dureeNuit.getHours() * 3600 + dureeNuit.getMinutes() * 60,
      dateDeb: date,
      probaPouv: parseFloat(probaPouv),
      probaLoup: parseFloat(probaLoup),
    };

    fetchData("game", "POST", data)
      .then((json) => {
        if (json.token === false) {
          onDisconnect();
          window.alert("You are not authentified, please reconnect");
        } else {
          console.log(json);
        }
      })
      .catch((error) => console.log(error));
    // }
  }

  return (
    <View>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{textError}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Fermer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <BarScrollInt onPress={setNbJoueur} title={"Nombre de joueurs"} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textGros}>Le jour durera:</Text>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Pressable onPress={() => setShowDureeJour(true)}>
              <Text style={styles.selecDate}>{TextDureeJour}</Text>
            </Pressable>
          </View>
        </View>
        {showDureeJour && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dureeJour}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChangeDureeJour}
          />
        )}

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textGros}>La nuit durera:</Text>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Pressable onPress={() => setShowDureeNuit(true)}>
              <Text style={styles.selecDate}>{TextDureeNuit}</Text>
            </Pressable>
          </View>
        </View>
        {showDureeNuit && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dureeNuit}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChangeDurerNuit}
          />
        )}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textGros}>Le début de la partie sera le:</Text>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Pressable onPress={() => showMode("date")}>
              <Text style={styles.selecDate}>{text}</Text>
            </Pressable>
            <Text style={styles.textGros}> à : </Text>
            <Pressable onPress={() => showMode("time")}>
              <Text style={styles.selecDate}>{horraire}</Text>
            </Pressable>
          </View>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textGros}>
            Proba d&apos;apparition des loups : {probaLoup}
          </Text>
          <Slider
            style={{ width: "100%", height: 10 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="rgb(255,0,0)"
            maximumTrackTintColor="rgb(0,0,255)"
            value={parseFloat(probaLoup)}
            onValueChange={(value) => setProbaLoup(value.toString())}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.textGros}>
            Proba d&apos;apparition des pouvoirs : {probaPouv}
          </Text>
          <Slider
            style={{ width: "100%", height: 10 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="rgb(255,0,0)"
            maximumTrackTintColor="rgb(0,0,255)"
            value={parseFloat(probaPouv)}
            onValueChange={(value) => setProbaPouv(value.toString())}
          />
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <SizedButton
            buttonLabel={"Créer la partie"}
            onPress={() => creationPartie()}
            size={"small"}
            buttonLabelStyle={styles.selectionButton}
            buttonStyle={styles.selectionButtonLabel}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selecDate: {
    borderWidth: 1,
    textAlign: "center",
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
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
  input: {
    textAlign: "center",
    borderWidth: 1,
    height: 40,
    width: 50,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
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
  textGros: {
    fontSize: 17,
    fontWeight: "bold",
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

CreateNewGame.propTypes = {
  onDisconnect: PropTypes.func.isRequired,
};
