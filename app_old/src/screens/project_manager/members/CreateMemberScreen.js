import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from "../../../store/creds";
import { searchUsers, createUser } from "../../../store/user";
import theme from '../../../theme/theme';
import commonStyles from '../../../theme/commonStyles';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const CreateMemberPage = () => {
	const navigation = useNavigation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [hourlyRate, setHourlyRate] = useState('');
	const [firstName, setFirstName] = useState(''); // New state variable for first name
	const [lastName, setLastName] = useState(''); // New state variable for last name
	const [jobTitle, setJobTitle] = useState('');

	const handleCancel = () => {
		navigation.goBack();
	};

	const handleSave = async () => {
		if (!email || !password || !hourlyRate) {
			Alert.alert('Error', 'Please fill in all fields.');
			return;
		}

		if (!isValidEmail(email)) {
			Alert.alert('Error', 'Please enter a valid email address.');
			return;
		}

		if (password.length < 8) {
			Alert.alert('Error', 'Password should be at least 8 characters long.');
			return;
		}

		if (!isValidHourlyRate(hourlyRate)) {
			Alert.alert('Error', 'Please enter a valid hourly rate.');
			return;
		}

		let userExists = await searchUsers(email);

		if (userExists != null) {
			Alert.alert("Error", "User already exists");
			return;
		}

		user = await getUserData();

		// If validation passes and user doesn't exist, create user
		await createUser({
			email,
			password,
			type: "regular",
			hourly_rate: parseFloat(hourlyRate),
			first_name: firstName,
			last_name: lastName,
			job_title: jobTitle,
			created_by: user.email
		});

		// Then redirect the user to the login screen or anywhere you want
		handleCancel();
	};

	const isValidEmail = (email) => {
		// Email validation logic
		// You can use regular expressions or any other validation library to validate the email format
		// Here's a simple example using a regular expression
		const emailRegex = /\S+@\S+\.\S+/;
		return emailRegex.test(email);
	};

	const isValidHourlyRate = (hourlyRate) => {
		// Hourly rate validation logic
		// You can check if the hourly rate is a valid float greater than or equal to 0
		const rate = parseFloat(hourlyRate);
		return !isNaN(rate) && rate >= 0;
	};

	return (
		<View style={styles.scroll}>
			<View style={styles.ctaContainer}>
				<TouchableOpacity onPress={handleCancel}>
					<Ionicons name="close-outline" style={{ color: '#D85151' }} size={36} />
				</TouchableOpacity>
				<Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>Create Member</Text>
				<TouchableOpacity onPress={handleSave}>
					<Ionicons name="checkmark-outline" style={{ color: '#34A654' }} size={36} />
				</TouchableOpacity>
			</View>
			<ScrollView>
				<View style={commonStyles.inputContainer}>
					<TextInput style={commonStyles.inputLabel}>Email</TextInput>
					<TextInput
						style={styles.input}
						onChangeText={setEmail}
						value={email}
						autoCapitalize='none'
						keyboardType='email-address'
					/>
				</View>
				<View style={commonStyles.inputContainer}>
					<TextInput style={commonStyles.inputLabel}>Password</TextInput>
					<TextInput
						style={styles.input}
						onChangeText={setPassword}
						value={password}
						autoCapitalize='none'
					/>
				</View>
				<View style={commonStyles.inputContainer}>
					<TextInput style={commonStyles.inputLabel}>First Name</TextInput>
					<TextInput
						style={styles.input}
						onChangeText={setFirstName}
						value={firstName}
					/>
				</View>
				<View style={commonStyles.inputContainer}>
					<TextInput style={commonStyles.inputLabel}>Last Name</TextInput>
					<TextInput
						style={styles.input}
						onChangeText={setLastName}
						value={lastName}
					/>
				</View>
				<View style={commonStyles.inputContainer}>
					<TextInput style={commonStyles.inputLabel}>Job Title</TextInput>
					<TextInput
						style={styles.input}
						onChangeText={setJobTitle}
						value={jobTitle}
					/>
				</View>
				<View style={[commonStyles.inputContainer, { marginBottom: 20 }]}>
					<TextInput style={commonStyles.inputLabel}>Hourly Rate</TextInput>
					<TextInput
						style={styles.input}
						onChangeText={setHourlyRate}
						value={hourlyRate}
						keyboardType='decimal-pad'
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	scroll: {
		backgroundColor: theme.colors.white,
		height: "100%",
		marginBottom: 90
	},
	heading: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	buttons: {
		marginBottom: 20,
	},
	buttonText: {
		fontSize: 20,
		fontWeight: 'bold',
		lineHeight: 30,
	},
	input: {
		borderWidth: 1,
		borderColor: theme.colors.grey,
		borderRadius: 4,
		padding: 10,
	},
	ctaContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 60,
		backgroundColor: theme.colors.white,
		paddingHorizontal: 10,
	},
});

export default CreateMemberPage;