import { StyleSheet, TextInput, View, ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import { manipulateAsync } from "expo-image-manipulator";
import MonBouton from "./MonBouton";
import ResizedText from "./ResizedText";

export default function LoginForm({ onConnect }) {
  const [username, setUsername] = useState("Testeur");
  const [password, setPassword] = useState("oui");
  const [imageUri, setImageUri] = useState(null);

  // Resize background image using manipulateAsync
  useEffect(() => {
    const resizeImage = async () => {
      try {
        const result = await manipulateAsync(
          require("../assets/werewolf.png"), // Input image URI
          [{ resize: { width: 100, height: 100 } }], // Array of transformation options
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
            <ResizedText
              label="Connectez-vous"
              size="xlarge"
              textStyle={styles.loginTitle}
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

            <MonBouton
              nativeID="connect"
              label="Se connecter"
              onPress={() => onConnect(username, password)}
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
});
