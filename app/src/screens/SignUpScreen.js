import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import theme from '../theme/theme';
import commonStyles from '../theme/commonStyles';
import { createUser, searchUsers } from "../store/user";

const Signup = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [hidePassword, setHidePassword] = useState(true);
	const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

	const toggleHidePassword = () => {
		setHidePassword(!hidePassword);
	};

	const toggleHideConfirmPassword = () => {
		setHideConfirmPassword(!hideConfirmPassword);
	};

	const handleSignup = async () => {
		// Simple regex for validation
		let emailCheck = /\S+@\S+\.\S+/;
		let passwordCheck = password.length >= 8;
		let passwordConfirmCheck = password === confirmPassword;

		if (!emailCheck.test(email)) {
			Alert.alert("Error", "Please enter a valid email.");
			return;
		}

		if (!passwordCheck) {
			Alert.alert("Error", "Password should be at least 8 characters long.");
			return;
		}

		if (!passwordConfirmCheck) {
			Alert.alert("Error", "Passwords do not match.");
			return;
		}

		// Search the user in the database
		let userExists = await searchUsers(email);

		if (userExists != null) {
			Alert.alert("Error", "User already exists.");
			return;
		}

		// If validation passes and user doesn't exist, create user
		await createUser({ email, password, type: "admin", hourly_rate: 0.0, first_name: "", last_name: "", job_title: "CEO" }); // Update the type and hourly_rate as per your requirements
		Alert.alert("Success", "User created successfully.");

		// Then redirect the user to the login screen or anywhere you want
		navigation.navigate("Login");
	};

	return (
		<View style={commonStyles.container}>
			<Image source={require('../../assets/logo_icon.png')} style={commonStyles.logo} resizeMode='contain' />
			<Text style={commonStyles.heading}>Get started with ANTask</Text>
			<View style={commonStyles.inputContainer}>
				<Text style={commonStyles.inputLabel}>Email</Text>
				<TextInput
					style={commonStyles.input}
					autoCapitalize='none'
					onChangeText={setEmail}
					value={email}
					keyboardType='email-address'
				/>
			</View>
			<View style={commonStyles.inputContainer}>
				<Text style={commonStyles.inputLabel}>Password</Text>
				<View style={styles.passwordContainer}>
					<TextInput
						style={styles.passwordInput}
						autoCapitalize='none'
						onChangeText={setPassword}
						value={password}
						secureTextEntry={hidePassword}
					/>
					<TouchableOpacity style={styles.iconContainer} onPress={toggleHidePassword}>
						<Image
							source={hidePassword ? require('../../assets/eye-closed.png') : require('../../assets/eye-open.png')}
							style={styles.icon}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<View style={commonStyles.inputContainer}>
				<Text style={commonStyles.inputLabel}>Confirm Password</Text>
				<View style={styles.passwordContainer}>
					<TextInput
						style={styles.passwordInput}
						autoCapitalize='none'
						onChangeText={setConfirmPassword}
						value={confirmPassword}
						secureTextEntry={hideConfirmPassword}
					/>
					<TouchableOpacity style={styles.iconContainer} onPress={toggleHideConfirmPassword}>
						<Image
							source={hideConfirmPassword ? require('../../assets/eye-closed.png') : require('../../assets/eye-open.png')}
							style={styles.icon}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.button]} onPress={handleSignup}>
				<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Sign Up</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
				<Text style={commonStyles.bold}>Already have an account? </Text><Text style={[commonStyles.link, commonStyles.bold]}>Login</Text>
			</TouchableOpacity>
		</View>
	);
};

// You can reuse the styles from Login component
const styles = StyleSheet.create({
	inputContainer: {
		width: '90%',  // Or any suitable value
		alignSelf: 'center',
		marginTop: 20,
	},
	passwordContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: theme.colors.grey,
		borderRadius: 5,
		width: '100%',
		alignSelf: 'center',
		backgroundColor: theme.colors.greyBackground,
	},
	passwordInput: {
		minWidth: "88%",
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: theme.fontWeight.medium,
	},
	iconContainer: {
		borderLeftWidth: 1,
		borderColor: theme.colors.grey,
		padding: 10,
	},
	icon: {
		width: 20,   
		height: 16,
	},
	linkContainer: {
		flexDirection: "row",
		marginBottom: 20,
	},
	button: {
		width: '90%',
	}
});

export default Signup;
