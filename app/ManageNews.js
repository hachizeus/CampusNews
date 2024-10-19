import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons

const ManageNews = () => {
  const navigation = useNavigation();
  const [selectedMedia, setSelectedMedia] = useState(null); // State to hold the selected media

  const handleAddNews = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Select all media types
      allowsEditing: true, // Allow editing if needed
      aspect: [4, 3], // Aspect ratio for editing
      quality: 1, // Quality of the selected media
    });

    if (!result.canceled) {
      console.log("Selected Media: ", result.assets); // Log the selected media
      setSelectedMedia(result.assets[0]); // Set the selected media for preview
    }
  };

  const handleViewNews = () => {
    console.log("View News Pressed");
    navigation.navigate('ViewNews');
  };

  const handlePost = () => {
    console.log("Post Pressed");
    // Add your post functionality here
    // Example: send the selectedMedia to your backend or handle it as needed
  };

  const handleCancel = () => {
    setSelectedMedia(null); // Reset the selected media
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage News</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddNews}>
        <Text style={styles.buttonText}>Add News</Text>
      </TouchableOpacity>
      {selectedMedia && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedMedia.uri }} // Use the uri of the selected media for the preview
            style={styles.previewImage} // Styles for the preview image
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handlePost} style={styles.iconButton}>
              <MaterialIcons name="post-add" size={24} color="green" />
              <Text style={styles.iconText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.iconButton}>
              <MaterialIcons name="cancel" size={24} color="red" />
              <Text style={styles.iconText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleViewNews}>
        <Text style={styles.buttonText}>View News</Text>
      </TouchableOpacity>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  previewContainer: {
    alignItems: 'center', // Center items in the preview container
  },
  previewImage: {
    width: 200, // Width of the preview image
    height: 200, // Height of the preview image
    marginVertical: 20, // Margin for spacing
    borderRadius: 10, // Rounded corners for the image
  },
  iconContainer: {
    flexDirection: 'row', // Align icons horizontally
    justifyContent: 'space-around', // Space out icons evenly
    width: '100%', // Take full width for the icons
  },
  iconButton: {
    alignItems: 'center', // Center icon and text
  },
  iconText: {
    marginTop: 5, // Space between icon and text
  },
});

export default ManageNews;
