import AsyncStorage from "@react-native-async-storage/async-storage";
const config = require("../config");
const { BACKEND } = config;

export async function fetchData(path, method, body) {
  const token = await AsyncStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": token,
  };
  const options = {
    method,
    headers,
    body: JSON.stringify(body),
  };
  const response = await fetch(`${BACKEND}/${path}`, options);
  const json = await response.json();
  console.log(json)

  return json;
}
