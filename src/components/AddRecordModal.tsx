import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

import { Box, Button, ButtonText, Input, InputField } from "@/components";
import {
  useCreateBabTrackingMutation,
  BAB_TRACKING_LIST_QUERY_KEY,
  type BabColor,
  type BabConsistency,
  type BabVolume,
  type CreateBabTrackingRequest,
} from "@/features/home/api/bab-tracking";

type AddRecordModalProps = {
  visible: boolean;
  onClose: () => void;
};

type StoolTypeOption = {
  id: string;
  label: string;
  pattern: string;
  bristolScale: number;
  consistency: BabConsistency;
};

const stoolTypes: StoolTypeOption[] = [
  { id: "hard", label: "Hard", pattern: "dots", bristolScale: 1, consistency: "VERY_HARD" },
  { id: "lumpy", label: "Lumpy", pattern: "lumpy", bristolScale: 2, consistency: "HARD" },
  { id: "cracked", label: "Cracked", pattern: "cracked", bristolScale: 3, consistency: "NORMAL" },
  { id: "smooth", label: "Smooth", pattern: "smooth", bristolScale: 4, consistency: "NORMAL" },
  { id: "soft", label: "Soft", pattern: "soft", bristolScale: 5, consistency: "SOFT" },
  { id: "fluffy", label: "Fluffy", pattern: "fluffy", bristolScale: 6, consistency: "VERY_SOFT" },
  { id: "liquid", label: "Liquid", pattern: "liquid", bristolScale: 7, consistency: "LIQUID" },
];

type ColorOption = {
  id: string;
  label: string;
  swatch: string;
  value: BabColor;
};

const colorOptions: ColorOption[] = [
  { id: "brown", label: "Brown", swatch: "#774c36", value: "BROWN" },
  { id: "yellow", label: "Yellow", swatch: "#f4c842", value: "YELLOW" },
  { id: "green", label: "Green", swatch: "#4cbc7c", value: "GREEN" },
  { id: "red", label: "Red", swatch: "#f45b69", value: "RED" },
  { id: "black", label: "Black", swatch: "#30313d", value: "BLACK" },
  { id: "pale", label: "Pale", swatch: "#d9d9e0", value: "WHITE" },
];

type VolumeOption = {
  id: string;
  label: string;
  value: BabVolume;
};

const volumeOptions: VolumeOption[] = [
  { id: "small", label: "Small", value: "SMALL" },
  { id: "medium", label: "Medium", value: "MEDIUM" },
  { id: "large", label: "Large", value: "LARGE" },
];

export const AddRecordModal = ({ visible, onClose }: AddRecordModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [foodIntake, setFoodIntake] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [iosPickerMode, setIosPickerMode] = useState<"date" | "time">("date");
  const [showIosPicker, setShowIosPicker] = useState(false);
  const createRecordMutation = useCreateBabTrackingMutation();
  const queryClient = useQueryClient();

  const isSaveDisabled = useMemo(
    () => !selectedType || !selectedColor || !selectedVolume,
    [selectedType, selectedColor, selectedVolume]
  );
  const isButtonDisabled = isSaveDisabled || createRecordMutation.isPending;

  const resetForm = () => {
    setSelectedType(null);
    setSelectedColor(null);
    setSelectedVolume(null);
    setFoodIntake("");
    setSelectedDateTime(new Date());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (isButtonDisabled) return;

    const type = stoolTypes.find((item) => item.id === selectedType);
    const color = colorOptions.find((item) => item.id === selectedColor);
    const volume = volumeOptions.find((item) => item.id === selectedVolume);

    if (!type || !color || !volume) return;

    const payload: CreateBabTrackingRequest = {
      dateTime: selectedDateTime.toISOString(),
      bristolScale: type.bristolScale,
      consistency: type.consistency,
      color: color.value,
      volume: volume.value,
    };

    const trimmedFoodIntake = foodIntake.trim();
    if (trimmedFoodIntake) {
      payload.notes = trimmedFoodIntake;
    }

    try {
      await createRecordMutation.mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: BAB_TRACKING_LIST_QUERY_KEY });
      Alert.alert("Record saved", "Your bowel movement has been logged successfully.");
      handleClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save record.";
      Alert.alert("Unable to save record", message);
    }
  };

  const renderPattern = (pattern: string) => {
    switch (pattern) {
      case "dots":
        return (
          <View style={styles.patternRow}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.patternDot} />
            ))}
          </View>
        );
      case "lumpy":
        return (
          <View style={styles.patternRow}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={[styles.patternDot, { width: 14, height: 10 }]} />
            ))}
          </View>
        );
      case "cracked":
        return <View style={[styles.patternLine, { width: "70%" }]} />;
      case "smooth":
        return <View style={[styles.patternLine, { width: "80%", borderRadius: 999 }]} />;
      case "soft":
        return (
          <View style={styles.patternRow}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={[styles.patternDot, { width: 12, height: 12 }]} />
            ))}
          </View>
        );
      case "fluffy":
        return (
          <View style={styles.patternRow}>
            {[...Array(5)].map((_, index) => (
              <View key={index} style={[styles.patternDot, { width: 10, height: 8 }]} />
            ))}
          </View>
        );
      case "liquid":
        return <View style={[styles.patternLine, { width: "90%", height: 10, borderRadius: 10 }]} />;
      default:
        return null;
    }
  };

  const updateDatePortion = (nextDate: Date) => {
    setSelectedDateTime((prev) => {
      const updated = new Date(prev);
      updated.setFullYear(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
      return updated;
    });
  };

  const updateTimePortion = (nextDate: Date) => {
    setSelectedDateTime((prev) => {
      const updated = new Date(prev);
      updated.setHours(nextDate.getHours(), nextDate.getMinutes(), 0, 0);
      return updated;
    });
  };

  const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      updateDatePortion(date);
    }
  };

  const handleTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (date) {
      updateTimePortion(date);
    }
  };

  const handleIosPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "dismissed") {
      setShowIosPicker(false);
      return;
    }
    if (date) {
      if (iosPickerMode === "date") {
        updateDatePortion(date);
      } else {
        updateTimePortion(date);
      }
    }
    setShowIosPicker(false);
  };

  const openPicker = (mode: "date" | "time") => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode,
        value: selectedDateTime,
        onChange: mode === "date" ? handleDateChange : handleTimeChange,
        is24Hour: false,
      });
      return;
    }
    setIosPickerMode(mode);
    setShowIosPicker(true);
  };

  const formattedDate = selectedDateTime.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = selectedDateTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Record</Text>
            <Pressable onPress={handleClose} hitSlop={16}>
              <Ionicons name="close" size={22} color="#2f3542" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Date &amp; Time</Text>
              <View className="flex-row gap-3">
                <Pressable
                  style={styles.dateTimeChip}
                  onPress={() => openPicker("date")}
                  accessibilityRole="button"
                  accessibilityLabel="Select date"
                >
                  <Ionicons name="calendar-outline" size={16} color="#2f3542" />
                  <Text style={styles.dateTimeText}>{formattedDate}</Text>
                </Pressable>
                <Pressable
                  style={styles.dateTimeChip}
                  onPress={() => openPicker("time")}
                  accessibilityRole="button"
                  accessibilityLabel="Select time"
                >
                  <Ionicons name="time-outline" size={16} color="#2f3542" />
                  <Text style={styles.dateTimeText}>{formattedTime}</Text>
                </Pressable>
              </View>
              {Platform.OS === "ios" && showIosPicker && (
                <DateTimePicker
                  mode={iosPickerMode}
                  display="spinner"
                  value={selectedDateTime}
                  onChange={handleIosPickerChange}
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Bristol Stool Type *</Text>
              <View style={styles.grid}>
                {stoolTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    style={[
                      styles.optionCard,
                      selectedType === type.id && styles.optionCardSelected,
                    ]}
                  >
                    <View style={styles.patternWrapper}>{renderPattern(type.pattern)}</View>
                    <Text style={styles.optionLabel}>{type.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <Pressable
                    key={color.id}
                    onPress={() => setSelectedColor(color.id)}
                    style={[
                      styles.colorOption,
                      selectedColor === color.id && styles.optionCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color.swatch },
                        color.id === "pale" && styles.colorSwatchBorder,
                      ]}
                    />
                    <Text style={styles.optionLabel}>{color.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Volume</Text>
              <View style={styles.volumeRow}>
                {volumeOptions.map((volume) => (
                  <Pressable
                    key={volume.id}
                    onPress={() => setSelectedVolume(volume.id)}
                    style={[
                      styles.volumeOption,
                      selectedVolume === volume.id && styles.optionCardSelected,
                    ]}
                  >
                    <Text style={styles.optionLabel}>{volume.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Food Intake (Optional)</Text>
              <Input className="h-11 rounded-xl bg-[#f3f3f5]" size="lg">
                <InputField
                  placeholder="e.g., Spicy noodles, Coffee..."
                  placeholderTextColor="#9ca3af"
                  value={foodIntake}
                  onChangeText={setFoodIntake}
                />
              </Input>
            </View>
          </ScrollView>

          <Box className="mt-5">
            <Button
              disabled={isButtonDisabled}
              className="h-12 rounded-xl bg-[#0c64ff]"
              style={isButtonDisabled ? styles.disabledButton : styles.enabledButton}
              onPress={handleSave}
            >
              {createRecordMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ButtonText className="text-base font-semibold text-white opacity-80">
                  Save Record
                </ButtonText>
              )}
            </Button>
          </Box>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderRadius: 28,
    backgroundColor: "#f9fafb",
    padding: 24,
    shadowColor: "#0f172a",
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionCard: {
    width: "30%",
    borderRadius: 18,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionCardSelected: {
    borderColor: "#0c64ff",
    shadowColor: "#0c64ff",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  patternWrapper: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  patternRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  patternDot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#8c6239",
  },
  patternLine: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#8c6239",
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  colorOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  colorSwatchBorder: {
    borderWidth: 1,
    borderColor: "#c4c4d4",
  },
  dateTimeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#f3f3f5",
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2933",
  },
  volumeRow: {
    flexDirection: "row",
    gap: 12,
  },
  volumeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  enabledButton: {
    shadowColor: "#0c64ff",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
  },
  disabledButton: {
    backgroundColor: "#cbd5f5",
  },
});
