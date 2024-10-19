import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';

const Profile = () => {
  // States for profile information
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    mobile: '+1234567890',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Update profile data when editing
  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data logic here (e.g., API call or local storage update)
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/me.jpg')} style={styles.profileImage} />
      {isEditing ? (
        <View style={styles.editForm}>
          <TextInput
            style={styles.input}
            value={profileData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={profileData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
            placeholder="Last Name"
          />
          <TextInput
            style={styles.input}
            value={profileData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={profileData.mobile}
            onChangeText={(text) => handleInputChange('mobile', text)}
            placeholder="Mobile"
          />
          <Button title="Save" onPress={handleSave} />
        </View>
      ) : (
        <View style={styles.profileDetails}>
          <Text style={styles.label}>First Name: {profileData.firstName}</Text>
          <Text style={styles.label}>Last Name: {profileData.lastName}</Text>
          <Text style={styles.label}>Email: {profileData.email}</Text>
          <Text style={styles.label}>Mobile: {profileData.mobile}</Text>
          <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileDetails: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  editForm: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
});

export default Profile;
