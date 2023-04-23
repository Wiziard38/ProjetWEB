import { useState, React, useEffect } from "react";
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
import SizedText from "./SizedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import ProbaIntSlider from "./CreateGameComps/ProbaIntSlider";
import BarScrollInt from "./CreateGameComps/BarScrollInt";
import TimeChoose from "./CreateGameComps/TimeChoose";

export default function CreateNewGame({ onDisconnect }) {
  const [dureeJour, setDureeJour] = useState(new Date());
  const [dureeNuit, setDureeNuit] = useState(new Date());
  const [timeDebut, setTimeDebut] = useState(new Date());

  useEffect(() => {
    setDureeJour((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(14);
      newDate.setMinutes(0);
      return newDate;
    });
    setDureeNuit((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(10);
      newDate.setMinutes(0);
      return newDate;
    });
    setTimeDebut((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(8);
      newDate.setMinutes(0);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const [nbJoueur, setNbJoueur] = useState("5");
  const [probaPouv, setProbaPouv] = useState("0");
  const [probaLoup, setProbaLoup] = useState("0.3");
  const [modalVisible, setModalVisible] = useState(false);
  const [textError, setTextError] = useState("");


  function verificationDonnee() {
    // eslint-disable-line no-unused-vars
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
      dateDeb: timeDebut,
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

      <View style={styles.itemStyle}>
        <SizedText
          label={"Durée d'un jour :"}
          size="large"
          textStyle={styles.itemText}
        />
        <TimeChoose
          mode={"time"}
          minDate={false}
          dureePeriode={dureeJour}
          setDureePeriode={setDureeJour}
        />
      </View>

      <View style={styles.itemStyle}>
        <SizedText
          label={"Durée d'une nuit :"}
          size="large"
          textStyle={styles.itemText}
        />
        <TimeChoose
          mode={"time"}
          minDate={false}
          dureePeriode={dureeNuit}
          setDureePeriode={setDureeNuit}
        />
      </View>

      <View style={styles.itemStyle}>
        <SizedText
          label={"La partie commencera le :"}
          size="large"
          textStyle={{ fontWeight: "bold" }}
        />
        <View style={styles.itemStyleBegin}>
          <TimeChoose
            mode={"date"}
            minDate={true}
            dureePeriode={timeDebut}
            setDureePeriode={setTimeDebut}
          />

          <Text style={styles.beginText}>à</Text>
          <TimeChoose
            mode={"time"}
            minDate={true}
            dureePeriode={timeDebut}
            setDureePeriode={setTimeDebut}
          />
        </View>
      </View>

      <ProbaIntSlider
        labelProba={"Probabilité d'apparition d'un loup"}
        proba={probaLoup}
        setProba={setProbaLoup}
      />

      <ProbaIntSlider
        labelProba={"Probabilité d'obtention d'un pouvoir"}
        proba={probaPouv}
        setProba={setProbaPouv}
      />

      <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
        <SizedButton
          buttonLabel={"Créer la partie"}
          onPress={() => creationPartie()}
          size={"normal"}
          buttonLabelStyle={styles.selectionButton}
          buttonStyle={styles.selectionButtonLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    marginHorizontal: 15,
    marginVertical: 7,
  },
  itemStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemStyleBegin: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 3,
    marginBottom: 20,
  },
  beginText: {
    fontWeight: "bold",
    marginHorizontal: 10,
  },
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
