import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { getUserData } from '../../store/creds';
import { getResume, saveResume } from '../../store/resume';
import theme from '../../theme/theme';
import commonStyles from '../../theme/commonStyles';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';


const ViewResumeScreen = () => {
	const navigation = useNavigation();
	const [skill, setSkill] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [formType, setFormType] = useState("Education");
	const [title, setTitle] = useState("");
	const [institution, setInstitution] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [description, setDescription] = useState("");


	const [resume, setResume] = useState({
		_id: "-1",
		userId: "",
		personalInfo: {
			name: "",
			email: "",
		},
		educationExperiences: [],
		skills: []
	});

	useFocusEffect(
		useCallback(() => {
			const fetchResume = async () => {
				try {
					const user = await getUserData();
					const results = await getResume(user._id);
					setResume(results);
				} catch (error) {
					console.log(error)
				}
			};

			fetchResume();

		}, [])
	);

	const toggleModalVisibility = () => {
		setModalVisible(!modalVisible);
	};


	const addSkill = () => {
		if (skill.trim() !== "") {
			setResume(prevResume => ({
				...prevResume,
				skills: [...prevResume.skills, { name: skill, status: false }]
			}));
			setSkill('');
		}
	};

	const handleSaveResume = () => {
		let errMessage = "";
		if (!resume.personalInfo.name) {
			errMessage += "Name is required.";
		}
		if (!resume.personalInfo.email) {
			errMessage += "Email is required.";
		}
		if (errMessage != "") {
			Alert.alert(errMessage);
		}
		else {
			saveResume(resume);
			Alert.alert("Success", "Resume was updated successfully.");
		}
	}

	return (
		<View style={[commonStyles.container, styles.container]}>
			<ScrollView>
				<View style={styles.inputContainer}>
					<Text style={commonStyles.inputLabel}>Personal Details</Text>
				</View>
				<View style={styles.inputContainer}>
					<Text style={commonStyles.inputLabel}>Name</Text>
					<TextInput
						placeholder="Name"
						value={resume.personalInfo.name}
						onChangeText={(name) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, name } })}
						style={commonStyles.input}
					/>
				</View>
				<View style={styles.inputContainer}>
					<Text style={commonStyles.inputLabel}>Email</Text>
					<TextInput
						placeholder="Email"
						value={resume.personalInfo.email}
						onChangeText={(email) => setResume({ ...resume, personalInfo: { ...resume.personalInfo, email } })}
						style={[commonStyles.input]}
					/>
				</View>
				<View style={styles.ctaContainer}>
					<Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>Skills</Text>
				</View>

				<View style={[styles.staticContent, styles.commentContainer, ]}>
					<TextInput
						placeholder="Name a Skill"
						value={skill}
						onChangeText={setSkill}
						style={[commonStyles.input]}
					/>
					<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text></Text>
						<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.buttonComment]} onPress={addSkill}>
							<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary, { fontWeight: 400 }]}>
								ADD Skill <Ionicons name="add-circle-outline" size={16} />
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
						{resume.skills.map((item, index) =>
							<View
								key={index}
								style={{
									flexDirection: 'row',
									backgroundColor: item.status ? theme.colors.success : theme.colors.red,
									borderRadius: 15,
									margin: 5,
									paddingVertical: 5,
									paddingHorizontal: 10
								}}
							>
								<Text style={{ color: 'white' }}>{item.name}</Text>
							</View>
						)}
					</View>
				</View>
				<View style={styles.ctaContainer}>
					<Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>History</Text>
					<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, styles.buttonComment]} onPress={toggleModalVisibility}>
						<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary, { fontWeight: 400 }]}>
							Add History <Ionicons name="add-circle-outline" size={16} />
						</Text>
					</TouchableOpacity>
				</View>
				{resume.educationExperiences.map((item, index) =>
					<View style={[styles.staticContent, styles.commentContainer, { marginBottom: 10 }]} key={index}>
						<Text style={[commonStyles.labelTopNavHeading, commonStyles.bold]}>{ item.title }</Text>
						<Text>{ item.institution }</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<Text>Type:</Text>
							<Text>{ item.type }</Text>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
							<Text>{ item.start }</Text>
							<Text>{ item.end }</Text>
						</View>
						<Text>{ item.description }</Text>
					</View>
				)}
				<TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary, { width: "100%" }]} onPress={handleSaveResume}>
					<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary, { fontWeight: 400 }]}>
						Update Resume
					</Text>
				</TouchableOpacity>
			</ScrollView>

			<Modal
				animationType="slide"
				transparent={false}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.modalView}>
					<Text style={styles.modalTitle}>Add Education/Experience</Text>

					<View style={styles.inputContainer}>
						<Text style={commonStyles.inputLabel}>Status</Text>
						<View style={styles.border}>
							<Picker
								style={[commonStyles.input]}
								selectedValue={formType}
								onValueChange={(itemValue) => setFormType(itemValue)}
							>
								<Picker.Item label="Education" value="Education" />
								<Picker.Item label="Experience" value="Experience" />
							</Picker>
						</View>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder="Title"
							value={title}
							onChangeText={setTitle}
							style={commonStyles.input}
						/>

					</View>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder={formType === "Education" ? "School Name" : "Company Name"}
							value={institution}
							onChangeText={setInstitution}
							style={commonStyles.input}
						/>

					</View>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder="Start Date"
							value={start}
							onChangeText={setStart}
							style={commonStyles.input}
						/>

					</View>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder="End Date"
							value={end}
							onChangeText={setEnd}
							style={commonStyles.input}
						/>

					</View>
					<View style={styles.inputContainer}>
						<TextInput
							placeholder="Description"
							value={description}
							onChangeText={setDescription}
							style={commonStyles.input}
							multiline
						/>
					</View>
					<TouchableOpacity
						style={[commonStyles.button, commonStyles.buttonPrimary]}
						onPress={() => {
							const newExperience = {
								type: formType,
								title: title,
								institution: institution,
								start: start,
								end: end,
								description: description
							};

							// Update the resume state variable
							setResume(prevResume => ({
								...prevResume,
								educationExperiences: [...prevResume.educationExperiences, newExperience]
							}));

							// Close the modal and reset form fields
							setModalVisible(!modalVisible);
							setTitle("");
							setInstitution("");
							setStart("");
							setEnd("");
							setDescription("");
							setFormType("Education");
						}}
					>
						<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Submit</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[commonStyles.button, commonStyles.badgeGrey, { marginTop: 0 }]}
						onPress={() => {
							setModalVisible(!modalVisible);
						}}
					>
						<Text style={[commonStyles.buttonText, commonStyles.buttonTextPrimary]}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</Modal>


		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		paddingHorizontal: 20
	},
	button: {
		marginTop: 20,
		marginBottom: 20,
		width: 'auto',
		position: 'absolute',
		right: 20,
		bottom: 0,
	},
	inputContainer: {
		marginTop: 20,
	},
	ctaContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 60,
		backgroundColor: theme.colors.white,
		paddingHorizontal: 10,
	},
	ctaButton: {
		width: 'auto',
		borderWidth: 2,
		borderColor: theme.colors.primary,
		position: 'absolute',
		right: 20,
		bottom: 0,
	},
	ctaButtonText: {
		color: theme.colors.black,
	},
	staticContent: {
		backgroundColor: theme.colors.greyBackground,
		padding: 10,
		borderRadius: 5,
		width: '100%',
		display: 'flex',
	},
	listItem: {
		marginBottom: 20,
		backgroundColor: theme.colors.greyBackground,
		borderRadius: 5,
		padding: 10,
	},
	scroll: {
		backgroundColor: theme.colors.white,
		height: "100%",
		marginBottom: 90
	},
	taskList: {
		padding: 20,
	},
	border: {
		borderColor: theme.colors.grey,
		borderWidth: 1,
		borderRadius: 5,
	},
	staticContent: {
		backgroundColor: theme.colors.greyBackground,
		padding: 10,
		borderRadius: 5,
		width: '100%',
		display: 'flex',
	},
	status: {
		width: 100,
		textAlign: 'center',
	},
	badge: {
		textAlign: 'center',
		marginRight: 5,
		paddingLeft: 20,
		paddingRight: 20,
	},
	prereqContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 15,
	},
	buttonComment: {
		marginTop: 15,
		width: 'auto',
		paddingVertical: 10,
	},
	commentItem: {
		backgroundColor: '#EEEEEE',
		padding: 10,
		marginVertical: 5,
		borderRadius: 10,
		color: '#414141',
	},
	commentAudit: {
		color: '#9B9B9B',
		textAlign: 'right',
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
	},
	modalTitle: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 18,
		fontWeight: 'bold'
	},
});

export default ViewResumeScreen;
