import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
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
    const [entries, setEntries] = useState<any[]>([]); // ✅ Store hike records

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // in case it’s already formatted
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // ✅ Load hike entries on mount
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#E0F0FF" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Total Hike Records: {entries.length}
                </Text>

                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push("/profile")}
                    >
                        <Ionicons name="person-circle-outline" size={26} color="#4F46E5" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push("/entry-record")}
                    >
                        <Ionicons name="add-circle-outline" size={26} color="#4F46E5" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
                        <Ionicons name="search-outline" size={26} color="#4F46E5" />
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

            <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
            >
                {/* ✅ Display hike cards dynamically */}
                {entries.map((item, index) => (
                    <View
                        key={item.id || index}
                        style={[styles.cardContainer, !showSearch && { marginTop: 15 }]}
                    >
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

                            <TouchableOpacity style={styles.detailsButton}>
                                <Text style={styles.detailsText}>See More Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* If no records */}
                {entries.length === 0 && (
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
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
    },
    card: {
        width: "90%",
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
        backgroundColor: "#2563EB",
        borderRadius: 10,
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
