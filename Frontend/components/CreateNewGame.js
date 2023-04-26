import { useState, React, useEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import { fetchData } from "../utils/fetchData";
import SizedButton from "./SizedButton";
import SizedText from "./SizedText";
import DisplayMessage from "./DisplayMessage";
import { BarScrollInt, TimeChoose, ProbaIntSlider } from "./CreateGameComponents";

export default function CreateNewGame({ setMenuState, onDisconnect }) {
  const [dureeJour, setDureeJour] = useState(new Date());
  const [dureeNuit, setDureeNuit] = useState(new Date());
  const [dateDeb, setDateDeb] = useState(new Date());
  const [nbJoueur, setNbJoueur] = useState(5);
  const [probaPouv, setProbaPouv] = useState(0);
  const [probaLoup, setProbaLoup] = useState(0.3);

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
    setDateDeb((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(8);
      newDate.setMinutes(0);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [textError, setTextError] = useState("");

  function creationPartie() {
    console.log("creation partie");
    const data = {
      nbJoueur,
      dureeJour: dureeJour.getHours() * 3600 + dureeJour.getMinutes() * 60,
      dureeNuit: dureeNuit.getHours() * 3600 + dureeNuit.getMinutes() * 60,
      dateDeb,
      probaPouv,
      probaLoup,
    };

    fetchData("game", "POST", data)
      .then((json) => {
        if (json.token === false) {
          onDisconnect();
          window.alert("You are not authentified, please reconnect");
        } else {
          setModalVisible(true);
          setTextError("La partie a été créée avec succès !");
        }
      })
      .catch((error) => {
        console.log(error);
        setModalVisible(true);
        setTextError(error);
      });
  }

  return (
    <View style={styles.container}>
      <DisplayMessage
        visible={modalVisible}
        textMessage={textError}
        onPress={() => {
          setModalVisible(!modalVisible);
          setMenuState(0);
        }}
      />

      <BarScrollInt
        nbJoueur={nbJoueur}
        setNbJoueur={setNbJoueur}
        title={"Nombre de joueurs"}
      />

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
            dureePeriode={dateDeb}
            setDureePeriode={setDateDeb}
          />

          <Text style={styles.beginText}>à</Text>
          <TimeChoose
            mode={"time"}
            minDate={true}
            dureePeriode={dateDeb}
            setDureePeriode={setDateDeb}
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
});

CreateNewGame.propTypes = {
  onDisconnect: PropTypes.func.isRequired,
  setMenuState: PropTypes.func.isRequired,
};
