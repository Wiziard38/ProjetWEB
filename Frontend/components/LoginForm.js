import { useState, useEffect, React } from "react";
import { StyleSheet, TextInput, View, ImageBackground } from "react-native";
import SizedText from "./SizedText";
import SizedButton from "./SizedButton.js";
import PropTypes from "prop-types";

export default function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernamePlaceholder, setUsernamePlaceholder] = useState("Username");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Password");
  const [placeholderColor, setPlaceholderColor] = useState("#d1d1d1");

  const [submitText, setSubmitText] = useState("Se connecter");
  const [switchText, setSwitchText] = useState("Je m'inscris");

  useEffect(() => {
    if (props.loggingState) {
      setSubmitText("Se connecter");
      setSwitchText("Je m'inscris");
      props.setErrorTextValue("");
    } else {
      setSubmitText("S'inscrire");
      setSwitchText("Je me connecte");
      props.setErrorTextValue("");
    }
  }, [props.loggingState]); // Dependency array to run the effect each time mode is changed

  function submitForm() {
    if (username === "" || password === "") {
      setPlaceholderColor("red");
      setUsernamePlaceholder("Username : ce champ est requis");
      setPasswordPlaceholder("Password : ce champ est requis");
    } else if (username.length > 32) {
      props.setErrorTextValue("L'username est trop long !");
    } else if (password.length > 60) {
      props.setErrorTextValue("Le password est trop long !");
    } else {
      props.onConnect(username, password); // TODO ne pas envoyer le mdp en clair ?
    }
  }

  return (
    <ImageBackground
      source={require("../assets/images/login_bg.png")}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <View style={styles.switchButtonContainer}>
          <SizedButton
            buttonLabel={switchText}
            size={"large"}
            buttonStyle={{}}
            buttonLabelStyle={styles.switchButtonLabel}
            onPress={() => props.setLoggingState(!props.loggingState)}
          />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            nativeID="usernameInput"
            style={styles.formInput}
            onChangeText={setUsername}
            value={username}
            placeholder={usernamePlaceholder}
            placeholderTextColor={placeholderColor}
          />

          <TextInput
            nativeID="passwordInput"
            style={styles.formInput}
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholder={passwordPlaceholder}
            placeholderTextColor={placeholderColor}
          />

          <SizedText
            label={props.errorTextValue}
            size="small"
            textStyle={[
              styles.errorMessage,
              props.errorTextValue !== "" && { paddingHorizontal: 20 },
            ]}
          />
        </View>
      </View>
      <SizedButton
        buttonLabel={submitText}
        size={"xlarge"}
        buttonStyle={styles.submitButton}
        buttonLabelStyle={styles.submitButtonLabel}
        onPress={submitForm}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 10,
    backgroundColor: "#313e55a6",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center",
  },
  formInput: {
    width: "90%",
    marginVertical: 20,
    fontSize: 17,
    padding: 5,
    color: "white",
    borderBottomColor: "#c2c2c2",
    borderBottomWidth: 2,
    borderBottomEndRadius: 10,
    backgroundColor: "#282f3855",
  },
  formContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  errorMessage: {
    position: "absolute",
    alignSelf: "center",
    top: 0,
    color: "red",
    backgroundColor: "#282f38b8",
    paddingVertical: 5,
    margin: 10,
    borderRadius: 7,
    overflow: "hidden",
  },
  // Button for submission
  submitButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgb(143, 190, 187)",
    padding: 20,
    alignItems: "center",
  },
  submitButtonLabel: {
    color: "white",
    fontWeight: "bold",
  },
  // Button for changing mode (log in / sign in)
  switchButtonContainer: {
    position: "absolute",
    top: 25,
    right: 25,
    zIndex: 9,
  },
  switchButtonLabel: {
    color: "white",
    fontWeight: "bold",
  },
});

LoginForm.propTypes = {
  onConnect: PropTypes.func.isRequired,
  errorTextValue: PropTypes.string.isRequired,
  setErrorTextValue: PropTypes.func.isRequired,
  loggingState: PropTypes.bool.isRequired,
  setLoggingState: PropTypes.func.isRequired,
};
