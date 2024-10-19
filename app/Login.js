import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // Import axios for HTTP requests

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1076110751369-95c1j06t4endhd10c8otsmajstnu4rqb.apps.googleusercontent.com",
    webClientId:
      "1076110751369-utcdg85iitqgg59dl7euva80s31o4q6i.apps.googleusercontent.com",
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  useEffect(() => {
    handleEffect();
  }, [response]);

  const handleEffect = async () => {
    const user = await getLocalUser();
    if (user) {
      setUserInfo(user);
      navigation.navigate("Home");
    } else if (response?.type === "success") {
      await getUserInfo(response.authentication.accessToken);
    }
  };

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    return data ? JSON.parse(data) : null;
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);

      // Check the user's role after retrieving user info
      if (user.email === "victorgathecha@students.uonbi.ac.ke") {
        navigation.navigate("AdminHome"); // Navigate to Admin Home
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true); 
    try {
        const response = await axios.post("http://192.168.100.23:5000/login", {
            email,
            password,
        });

        if (response.data.message === 'Login successful') {
            const user = response.data.user;
            const token = response.data.token; // Get the token from the response

            await AsyncStorage.setItem("@user", JSON.stringify(user));
            await AsyncStorage.setItem("@token", token); // Store the token

            setUserInfo(user);
            navigation.navigate(user.role === 'admin' ? "AdminHome" : "Home");
        } else {
            setMessage(response.data.message);
        }
    } catch (error) {
        setMessage(error.response ? error.response.data.message : "Network error. Please try again.");
    } finally {
        setLoading(false); 
    }
};

  return (
    <ImageBackground
      source={{
        uri: "https://example.com/your-background-image.jpg", // Replace with your background image URL
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Login to Motalk</Text>
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
              secureTextEntry={!showPassword} // Toggle password visibility
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login with Email'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            disabled={!request || loading} // Disable button if request is not ready or loading
            onPress={() => promptAsync()}
          >
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Text
            style={styles.footerText}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Forgot Password?
          </Text>
          <Text
            style={styles.footerText}
            onPress={() => navigation.navigate("SignUp")}
          >
            Don’t have an account? Sign Up
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
  message: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Login;
