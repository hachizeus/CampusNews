// ManageUsers.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ManageUsers = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      {/* Add functionality to manage users here */}
      <Button title="Add User" onPress={() => {/* Add user logic */}} />
      <Button title="View Users" onPress={() => {/* View users logic */}} />
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
});

export default ManageUsers;
