import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const navigation = useNavigation();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@students\.uonbi\.ac\.ke$/;

      if (!emailRegex.test(email)) {
        Alert.alert("Invalid Email", "Please enter your student email.");
        return;
      }

      const response = await axios.post('http://192.168.100.23:5000/signup', {
        full_name: name,
        email,
        password,
      });

      console.log("Signing up:", { name, email, password });
      setMessage(response.data.message);

      navigation.navigate("Login");
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error signing up');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://example.com/your-background-image.jpg' }} 
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create an Account</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" />
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#666" />
            <TextInput
              placeholder="Email"
              style={styles.input}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#666" />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          {message ? ( 
            <Text style={styles.messageText}>{message}</Text>
          ) : null}
          <Text
            style={styles.footerText}
            onPress={() => navigation.navigate("Login")}
          >
            Already have an account? Login
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4285F4",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    color: "#4285F4",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  messageText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default SignUp;
