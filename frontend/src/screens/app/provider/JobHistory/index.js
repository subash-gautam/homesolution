import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../../components/HomeHeader";
import { colors } from "../../../../utils/colors";

const JobHistory = ({ navigation }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [jobs, setJobs] = useState([
		{
			id: 1,
			title: "Plumbing Repair",
			date: "2023-10-01",
			location: "Lakeside, Pokhara",
			status: "completed",
			earnings: "1500",
		},
		{
			id: 2,
			title: "Pipe Fixing",
			date: "2023-10-05",
			location: "Bagar, Pokhara",
			status: "completed",
			earnings: "2000",
		},
		{
			id: 3,
			title: "Leakage Fix",
			date: "2023-10-10",
			location: "Chipledhunga, Pokhara",
			status: "cancelled",
			earnings: "0",
		},
	]);

	// Filter jobs based on search query
	const filteredJobs = jobs.filter((job) =>
		job.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSearch = (text) => {
		setSearchQuery(text);
	};

	const renderJobItem = ({ item }) => (
		<LinearGradient
			colors={["#ffffff", "#f5f5f5"]}
			style={styles.jobCard}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}>
			<View style={styles.jobHeader}>
				<Text style={styles.jobTitle}>{item.title}</Text>
				<Text style={styles.jobStatus(item.status)}>
					{item.status.toUpperCase()}
				</Text>
			</View>

			<View style={styles.jobDetails}>
				<Ionicons name="calendar" size={16} color={colors.text} />
				<Text style={styles.jobText}>{item.date}</Text>

				<Ionicons
					name="location"
					size={16}
					color={colors.text}
					style={styles.iconSpacing}
				/>
				<Text style={styles.jobText}>{item.location}</Text>
			</View>

			<View style={styles.jobFooter}>
				<Text style={styles.jobEarnings}>Rs. {item.earnings}</Text>
			</View>
		</LinearGradient>
	);

	return (
		<LinearGradient
			colors={["#f5f7fa", "#c3cfe2"]}
			style={styles.gradientContainer}>
			<Header
				title="Job History"
				showSearch={false}
				onSearch={handleSearch}
				showBack={true}
				onBackPress={() => navigation.goBack()}
			/>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Jobs List */}
				<FlatList
					data={filteredJobs}
					renderItem={renderJobItem}
					keyExtractor={(item) => item.id.toString()}
					scrollEnabled={false}
					ListEmptyComponent={
						<Text style={styles.noJobsText}>No jobs found</Text>
					}
				/>
			</ScrollView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	gradientContainer: {
		flex: 1,
	},
	content: {
		padding: 16,
		paddingBottom: 100,
	},
	jobCard: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
	},
	jobHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	jobTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.text,
	},
	jobStatus: (status) => ({
		color:
			status === "completed"
				? colors.success
				: status === "cancelled"
				? colors.error
				: colors.warning,
		fontWeight: "600",
	}),
	jobDetails: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	jobText: {
		marginLeft: 4,
		marginRight: 16,
		color: colors.text,
	},
	iconSpacing: {
		marginLeft: 12,
	},
	jobFooter: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	jobEarnings: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.success,
	},
	noJobsText: {
		textAlign: "center",
		color: colors.textSecondary,
		marginTop: 20,
	},
});

export default JobHistory;
