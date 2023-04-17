import {
  StyleSheet,
  TextInput,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { manipulateAsync } from "expo-image-manipulator";
import Sizedtext from "./SizedText";
import SizedButton from "./SizedButton.js";

export default function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // Resize background image using manipulateAsync
  useEffect(() => {
    const resizeImage = async () => {
      try {
        const imageSize = Dimensions.get("window").width / 4;
        const result = await manipulateAsync(
          require("../assets/werewolf.png"), // Input image URI
          [{ resize: { width: imageSize, height: imageSize } }], // Array of transformation options
          { format: "jpeg", compress: 0.8 } // Output options
        );
        setImageUri(result.uri); // Set the resized image URI to state
      } catch (error) {
        console.error("Failed to resize image:", error);
      }
    };

    // Call resizeImage when the component mounts
    resizeImage();
  }, []); // Empty dependency array to run the effect only once

  const [descriptionText, setDescriptionText] = useState("Je me connecte");
  const [switchText, setSwitchText] = useState("Je m'inscrit");
  const [submitText, setSubmitText] = useState("Se connecter");
  // Change login mode
  useEffect(() => {
    if (props.loggingState) {
      setDescriptionText("Je me connecte");
      setSubmitText("Se connecter");
      setSwitchText("Je m'inscris");
      props.setErrorTextValue("");
    } else {
      setDescriptionText("Je créé un compte");
      setSubmitText("S'inscrire");
      setSwitchText("Je me connecte");
      props.setErrorTextValue("");
    }
  }, [props.loggingState]); // Dependency array to run the effect each time mode is changed

  return (
    <View style={styles.container}>
      {/* Background image */}
      <ImageBackground
        source={imageUri}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.formBackground}>
            <Sizedtext
              label={descriptionText}
              size="xlarge"
              textStyle={styles.loginTitle}
            />

            <Sizedtext
              label={props.errorTextValue}
              size="small"
              textStyle={styles.errorMessage}
            />

            <TextInput
              nativeID="usernameInput"
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
            />

            <TextInput
              nativeID="passwordInput"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
            />

            <SizedButton
              buttonLabel={submitText}
              size={"normal"}
              buttonStyle={styles.submitButton}
              buttonLabelStyle={styles.submitButtonLabel}
              onPress={() => {
                if (username === "") {
                  props.setErrorTextValue(
                    "Le champ username ne peut être vide"
                  );
                } else if (password === "") {
                  props.setErrorTextValue(
                    "Le champ password ne peut être vide"
                  );
                } else if (username.length > 32) {
                  props.setErrorTextValue("L'username est trop long !");
                } else if (password.length > 60) {
                  props.setErrorTextValue("Le password est trop long !");
                } else {
                  props.onConnect(username, password); //TODO ne pas envoyer le mdp en clair ?
                }
              }}
            />

            <SizedButton
              buttonLabel={switchText}
              size={"mini"}
              buttonStyle={styles.switchButton}
              buttonLabelStyle={styles.switchButtonLabel}
              onPress={() => props.setLoggingState(!props.loggingState)}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  input: {
    height: 40,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formBackground: {
    backgroundColor: "rgb(187, 190, 143)",
    padding: 30,
    width: "65%",
    borderRadius: 10,
    borderColor: "#2c2c2c",
    borderWidth: 2,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  backgroundImage: {
    flex: 1, // Set flex to 1 to cover the entire container
  },
  backgroundImageStyle: {
    resizeMode: "repeat", // Set resizeMode to repeat
  },
  loginTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  errorMessage: {
    color: "red",
  },
  // Button for submission
  submitButton: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "black",
    padding: 10,
  },
  submitButtonLabel: {
    color: "white",
  },
  // Button for changing mode (log in / sign in)
  switchButton: {
    marginTop: 5,
  },
  switchButtonLabel: {
    color: "#383838",
    fontStyle: "italic",
    textAlign: "center",
  },
});
