import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { getAllEntries } from "../lib/database";

export default function HomeScreen() {
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState<any[]>([]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const loadEntries = async () => {
            try {
                const allEntries = await getAllEntries();
                setEntries(allEntries);
                console.log("📋 Loaded Entries:", allEntries);
            } catch (error) {
                console.error("❌ Error loading entries:", error);
            }
        };
        loadEntries();
    }, []);

    const toggleSearch = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowSearch(!showSearch);
    };

    // ✅ Filter entries by search text
    const filteredEntries = useMemo(() => {
        const lower = search.toLowerCase();
        return entries.filter((item) =>
            [item.name, item.location, item.length?.toString(), formatDate(item.dateOfHike)]
                .some((field) => field?.toLowerCase().includes(lower))
        );
    }, [entries, search]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#E0F0FF" />

            {/* Header */}
            {/* Header Card */}
            <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>
                    Total Hike Records: {entries.length}
                </Text>

                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push("/profile")}
                    >
                        <Ionicons name="person-circle-outline" size={26} color="#616161" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push("/entry-record")}
                    >
                        <Ionicons name="add-circle-outline" size={26} color="#616161" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
                        <Ionicons name="search-outline" size={26} color="#616161" />
                    </TouchableOpacity>
                </View>
            </View>


            {/* Search Box */}
            {showSearch && (
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search-outline"
                        size={18}
                        color="#6B7280"
                        style={{ marginRight: 6 }}
                    />
                    <TextInput
                        placeholder="Search by hike's name, location, length, or date"
                        placeholderTextColor="#6B7280"
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
            >
                {/* ✅ Display filtered cards */}
                {filteredEntries.map((item, index) => (
                    <View key={item.id || index} style={styles.cardContainer}>
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Name of Hike:</Text>
                                <Text style={styles.value}>{item.name}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Location:</Text>
                                <Text style={styles.value}>{item.location}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Length (metres):</Text>
                                <Text style={styles.value}>{item.length} m</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Date of Hike:</Text>
                                <Text style={styles.value}>{formatDate(item.dateOfHike)}</Text>
                            </View>

                            {/* ✅ Route to detail screen with ID */}
                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() =>
                                    Alert.alert(
                                        "View Details",
                                        `Are you sure you want to view details for "${item.name}"?`,
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Yes", onPress: () => router.push(`/entry-record?id=${item.id}`) }
                                        ],
                                        { cancelable: true }
                                    )
                                }
                            >
                                <Text style={styles.detailsText}>See More Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* If no records */}
                {filteredEntries.length === 0 && (
                    <Text style={{ marginTop: 40, color: "#6B7280" }}>
                        No hike records found.
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F0FF",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    headerCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    iconButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        paddingHorizontal: 10,
        height: 40,
        width: "100%",
        marginTop: 12,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        color: "#111827",
    },
    cardContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 15, // ✅ Always keep margin
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
    },
    value: {
        fontSize: 14,
        color: "#374151",
    },
    detailsButton: {
        backgroundColor: "#616161",
        borderRadius: 100,
        marginTop: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    detailsText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
});
