import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	Pressable,
	TextInput,
	ScrollView,
	StyleSheet,
	RefreshControl,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utils/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import backend, { socket } from "../../../../utils/api";

const ProviderHistoryScreen = ({ navigation }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [taskFilter, setTaskFilter] = useState("all");
	const [earningFilter, setEarningFilter] = useState("all");
	const [expandedItems, setExpandedItems] = useState(new Set());
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [bookings, setBookings] = useState([]);
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [topClients, setTopClients] = useState([]);
	const [stats, setStats] = useState({
		totalEarnings: 0,
		weeklyEarnings: 0,
		monthlyEarnings: 0,
		completionRate: 0,
	});
	const tabBarHeight = useBottomTabBarHeight();

	useEffect(() => {
		fetchProviderBookings();
	}, []);

	useEffect(() => {
		filterBookings();

		socket.on("user_updated_booking", (updatedBooking) => {
			fetchProviderBookings();
			console.log("User Updated Booking");
		});
	}, [bookings, taskFilter, searchQuery]);

	const fetchProviderBookings = async () => {
		setLoading(true);
		try {
			const userData = await AsyncStorage.getItem("providerData");
			if (!userData) throw new Error("Provider not found");

			const provider = JSON.parse(userData);
			const response = await axios.get(
				`${backend.backendUrl}/api/bookings?providerId=${provider.id}`,
			);

			const bookingsData = response.data;
			setBookings(bookingsData);

			// Calculate statistics
			calculateStatistics(bookingsData);

			// Identify top clients
			identifyTopClients(bookingsData);
		} catch (err) {
			console.error("Failed to fetch bookings:", err);
			Alert.alert("Error", "Failed to load booking history");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const calculateStatistics = (bookingsData) => {
		const now = new Date();
		const weekStart = new Date(now);
		weekStart.setDate(now.getDate() - now.getDay());

		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

		const completedBookings = bookingsData.filter(
			(b) => b.bookingStatus === "completed",
		);

		// Calculate total earnings
		const totalEarnings = completedBookings.reduce(
			(sum, booking) => sum + (booking.amount || 0),
			0,
		);

		// Calculate weekly earnings
		const weeklyEarnings = completedBookings
			.filter((b) => new Date(b.scheduledDate) >= weekStart)
			.reduce((sum, booking) => sum + (booking.amount || 0), 0);

		// Calculate monthly earnings
		const monthlyEarnings = completedBookings
			.filter((b) => new Date(b.scheduledDate) >= monthStart)
			.reduce((sum, booking) => sum + (booking.amount || 0), 0);

		// Calculate completion rate
		const completionRate =
			bookingsData.length > 0
				? (completedBookings.length / bookingsData.length) * 100
				: 0;

		setStats({
			totalEarnings,
			weeklyEarnings,
			monthlyEarnings,
			completionRate: Math.round(completionRate),
		});
	};

	const identifyTopClients = (bookingsData) => {
		// Group bookings by client
		const clientBookings = bookingsData.reduce((acc, booking) => {
			if (!booking.user) return acc;

			if (!acc[booking.user]) {
				acc[booking.user] = {
					name: booking.user,
					bookings: 0,
					amount: 0,
					completed: 0,
				};
			}

			acc[booking.user].bookings += 1;
			acc[booking.user].amount += booking.amount || 0;
			if (booking.bookingStatus === "completed") {
				acc[booking.user].completed += 1;
			}

			return acc;
		}, {});

		// Convert to array and sort by booking count
		const topClientsArray = Object.values(clientBookings)
			.sort((a, b) => b.bookings - a.bookings)
			.slice(0, 5)
			.map((client, index) => ({
				id: index.toString(),
				name: client.name,
				bookings: client.bookings,
				rating: ((client.completed / client.bookings) * 5).toFixed(1),
			}));

		setTopClients(topClientsArray);
	};

	const filterBookings = () => {
		let filtered = [...bookings];

		// Apply status filter
		if (taskFilter !== "all") {
			filtered = filtered.filter(
				(booking) =>
					booking.bookingStatus.toLowerCase() ===
					taskFilter.toLowerCase(),
			);
		}

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(booking) =>
					(booking.service &&
						booking.service.toLowerCase().includes(query)) ||
					(booking.category &&
						booking.category.toLowerCase().includes(query)) ||
					(booking.user &&
						booking.user.toLowerCase().includes(query)),
			);
		}

		setFilteredBookings(filtered);
	};

	const getEarningsForPeriod = () => {
		let earnings = 0;

		switch (earningFilter) {
			case "all":
				earnings = stats.totalEarnings;
				break;
			case "week":
				earnings = stats.weeklyEarnings;
				break;
			case "month":
				earnings = stats.monthlyEarnings;
				break;
		}

		return earnings;
	};

	const toggleItem = (itemId) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(itemId)) {
			newExpanded.delete(itemId);
		} else {
			newExpanded.add(itemId);
		}
		setExpandedItems(newExpanded);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchProviderBookings();
	};

	const formatDate = (dateString) => {
		const options = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "completed":
				return colors.success;
			case "confirmed":
				return colors.warning;
			case "pending":
				return colors.accent;
			case "rejected":
			case "cancelled":
				return colors.error;
			default:
				return colors.text;
		}
	};

	const renderStatusIndicator = (status) => {
		switch (status.toLowerCase()) {
			case "completed":
				return (
					<Ionicons
						name="checkmark-circle"
						size={20}
						color={colors.success}
					/>
				);
			case "confirmed":
			case "pending":
				return (
					<Ionicons
						name="time-outline"
						size={20}
						color={colors.warning}
					/>
				);
			case "rejected":
			case "cancelled":
				return (
					<Ionicons
						name="close-circle"
						size={20}
						color={colors.error}
					/>
				);
			default:
				return (
					<Ionicons
						name="help-circle"
						size={20}
						color={colors.gray}
					/>
				);
		}
	};

	const renderDetails = (booking) => (
		<View style={styles.detailsContainer}>
			<View style={styles.detailRow}>
				<Ionicons
					name="location-outline"
					size={16}
					color={colors.darkGray}
				/>
				<Text style={styles.detailText}>
					{booking.address || "Address not specified"}
					{booking.city ? `, ${booking.city}` : ""}
				</Text>
			</View>

			<View style={styles.detailRow}>
				<Ionicons
					name="calendar-outline"
					size={16}
					color={colors.darkGray}
				/>
				<Text style={styles.detailText}>
					{formatDate(booking.scheduledDate)}
				</Text>
			</View>

			<View style={styles.detailRow}>
				<MaterialIcons
					name="payment"
					size={16}
					color={colors.darkGray}
				/>
				<Text style={styles.detailText}>
					Payment Status: {booking.paymentStatus.toUpperCase()}
				</Text>
			</View>

			{booking.notes && (
				<View style={styles.detailRow}>
					<Ionicons
						name="document-text-outline"
						size={16}
						color={colors.darkGray}
					/>
					<Text style={styles.detailText}>
						Notes: {booking.notes}
					</Text>
				</View>
			)}
		</View>
	);

	const renderHistoryItem = ({ item }) => (
		<Pressable onPress={() => toggleItem(item.id)}>
			<LinearGradient
				colors={["#ffffff", "#f9f9f9"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.historyItem}>
				<View style={styles.itemHeader}>
					<Text style={styles.serviceName}>{item.service}</Text>
					{renderStatusIndicator(item.bookingStatus)}
				</View>
				<Text style={styles.categoryText}>{item.category}</Text>
				<Text style={styles.clientText}>Client: {item.user}</Text>
				<View style={styles.itemFooter}>
					<Text style={styles.dateText}>
						{formatDate(item.scheduledDate).split(",")[0]}
					</Text>
					<Text style={styles.priceText}>Rs. {item.amount || 0}</Text>
				</View>
				{expandedItems.has(item.id) && renderDetails(item)}
			</LinearGradient>
		</Pressable>
	);

	const renderRecurringClient = ({ item }) => (
		<LinearGradient
			colors={["#6a11cb", "#2575fc"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.clientCard}>
			<Text style={styles.clientName}>{item.name}</Text>
			<View style={styles.clientStats}>
				<Ionicons name="star" size={16} color={colors.warning} />
				<Text style={styles.clientRating}>{item.rating}</Text>
			</View>
			<Text style={styles.clientBookings}>{item.bookings} bookings</Text>
		</LinearGradient>
	);

	const FilterButton = ({ title, value, activeFilter, onPress }) => (
		<Pressable
			style={[
				styles.filterButton,
				activeFilter === value && styles.activeFilter,
			]}
			onPress={onPress}>
			<Text
				style={[
					styles.filterText,
					activeFilter === value && styles.activeFilterText,
				]}>
				{title}
			</Text>
		</Pressable>
	);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{
				paddingBottom: tabBarHeight + 20,
			}}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}>
			<LinearGradient
				colors={["#f5f7fa", "#c3cfe2"]}
				style={styles.gradient}>
				{/* Section 1: Search Field */}
				<View style={styles.searchSection}>
					<LinearGradient
						colors={["#ffffff", "#f9f9f9"]}
						style={styles.searchContainer}>
						<Ionicons
							name="search"
							size={20}
							color={colors.darkGray}
						/>
						<TextInput
							style={styles.searchInput}
							placeholder="Search services or clients..."
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
					</LinearGradient>
				</View>

				{/* Stats Overview */}
				<View style={styles.statsOverview}>
					<LinearGradient
						colors={["#ffffff", "#f5f5f5"]}
						style={styles.statsCard}>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>
								Completion Rate
							</Text>
							<Text style={styles.statValue}>
								{stats.completionRate}%
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Total Earnings</Text>
							<Text style={styles.statValue}>
								Rs. {stats.totalEarnings}
							</Text>
						</View>
					</LinearGradient>
				</View>

				{/* Section 2: Task Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Job History</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.filterContainer}>
						<FilterButton
							title="All"
							value="all"
							activeFilter={taskFilter}
							onPress={() => setTaskFilter("all")}
						/>
						<FilterButton
							title="Completed"
							value="completed"
							activeFilter={taskFilter}
							onPress={() => setTaskFilter("completed")}
						/>
						<FilterButton
							title="Confirmed"
							value="confirmed"
							activeFilter={taskFilter}
							onPress={() => setTaskFilter("confirmed")}
						/>
						<FilterButton
							title="Pending"
							value="pending"
							activeFilter={taskFilter}
							onPress={() => setTaskFilter("pending")}
						/>
						<FilterButton
							title="Rejected"
							value="rejected"
							activeFilter={taskFilter}
							onPress={() => setTaskFilter("rejected")}
						/>
					</ScrollView>

					{loading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator
								size="large"
								color={colors.primary}
							/>
						</View>
					) : filteredBookings.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Ionicons
								name="file-tray-outline"
								size={60}
								color={colors.gray}
							/>
							<Text style={styles.emptyText}>
								No bookings found
							</Text>
						</View>
					) : (
						<FlatList
							data={filteredBookings}
							renderItem={renderHistoryItem}
							keyExtractor={(item) => item.id.toString()}
							contentContainerStyle={styles.listContent}
							scrollEnabled={false}
						/>
					)}
				</View>

				{/* Section 4: Recurring Clients */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Top Clients</Text>
					{topClients.length > 0 ? (
						<FlatList
							horizontal
							data={topClients}
							renderItem={renderRecurringClient}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.clientsContainer}
							showsHorizontalScrollIndicator={false}
						/>
					) : (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>
								No client data available
							</Text>
						</View>
					)}
				</View>
			</LinearGradient>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		paddingTop: 20,
		paddingHorizontal: 16,
	},
	searchSection: {
		marginBottom: 16,
		paddingTop: 40,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		borderRadius: 10,
		elevation: 2,
	},
	searchInput: {
		flex: 1,
		marginLeft: 10,
	},
	statsOverview: {
		marginBottom: 16,
	},
	statsCard: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 16,
		borderRadius: 12,
		elevation: 2,
	},
	statItem: {
		alignItems: "center",
	},
	statLabel: {
		fontSize: 14,
		color: colors.textSecondary,
		marginBottom: 4,
	},
	statValue: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.primary,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: colors.text,
	},
	filterContainer: {
		marginBottom: 10,
	},
	filterButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		marginHorizontal: 4,
		backgroundColor: "#f0f0f0",
	},
	activeFilter: {
		backgroundColor: colors.primary,
	},
	filterText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
	},
	activeFilterText: {
		color: "#fff",
	},
	historyItem: {
		padding: 16,
		borderRadius: 10,
		marginBottom: 10,
		elevation: 2,
	},
	itemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	serviceName: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.text,
	},
	categoryText: {
		fontSize: 14,
		color: colors.primary,
		marginTop: 4,
	},
	clientText: {
		fontSize: 14,
		color: colors.darkGray,
		marginVertical: 4,
	},
	itemFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 4,
	},
	dateText: {
		fontSize: 12,
		color: colors.gray,
	},
	priceText: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.success,
	},
	detailsContainer: {
		marginTop: 10,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},
	detailText: {
		fontSize: 12,
		marginLeft: 6,
		color: colors.darkGray,
		flex: 1,
	},
	earningsCard: {
		padding: 16,
		borderRadius: 12,
		elevation: 2,
	},
	earningsLabel: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	earningsValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.success,
		marginVertical: 8,
	},
	earningsBreakdown: {
		marginTop: 12,
	},
	breakdownTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 8,
		color: colors.text,
	},
	breakdownItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},
	breakdownService: {
		fontSize: 12,
		color: colors.darkGray,
	},
	breakdownAmount: {
		fontSize: 12,
		fontWeight: "500",
		color: colors.text,
	},
	moreItems: {
		fontSize: 12,
		color: colors.primary,
		alignSelf: "flex-end",
		marginTop: 4,
	},
	clientCard: {
		padding: 16,
		borderRadius: 10,
		marginRight: 10,
		width: 150,
		elevation: 3,
	},
	clientName: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.white,
	},
	clientStats: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 4,
	},
	clientRating: {
		fontSize: 14,
		color: colors.white,
		marginLeft: 4,
	},
	clientBookings: {
		fontSize: 12,
		color: colors.white,
	},
	listContent: {
		paddingBottom: 10,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
	},
	emptyText: {
		fontSize: 16,
		color: colors.gray,
		marginTop: 10,
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 30,
	},
	exportButton: {
		marginVertical: 20,
	},
	exportGradient: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		borderRadius: 10,
		elevation: 2,
	},
	exportText: {
		fontSize: 16,
		fontWeight: "bold",
		color: colors.white,
		marginRight: 10,
	},
	clientsContainer: {
		paddingBottom: 16,
	},
});

export default ProviderHistoryScreen;
