import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Box, Button, ButtonText, Input, InputField } from "@/components";

type AddRecordModalProps = {
  visible: boolean;
  onClose: () => void;
};

const stoolTypes = [
  { id: "hard", label: "Hard", pattern: "dots" },
  { id: "lumpy", label: "Lumpy", pattern: "lumpy" },
  { id: "cracked", label: "Cracked", pattern: "cracked" },
  { id: "smooth", label: "Smooth", pattern: "smooth" },
  { id: "soft", label: "Soft", pattern: "soft" },
  { id: "fluffy", label: "Fluffy", pattern: "fluffy" },
  { id: "liquid", label: "Liquid", pattern: "liquid" },
];

const colorOptions = [
  { id: "brown", label: "Brown", swatch: "#774c36" },
  { id: "yellow", label: "Yellow", swatch: "#f4c842" },
  { id: "green", label: "Green", swatch: "#4cbc7c" },
  { id: "red", label: "Red", swatch: "#f45b69" },
  { id: "black", label: "Black", swatch: "#30313d" },
  { id: "pale", label: "Pale", swatch: "#d9d9e0" },
];

const volumeOptions = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

export const AddRecordModal = ({ visible, onClose }: AddRecordModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);

  const isSaveDisabled = useMemo(
    () => !selectedType || !selectedColor || !selectedVolume,
    [selectedType, selectedColor, selectedVolume]
  );

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

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Record</Text>
            <Pressable onPress={onClose} hitSlop={16}>
              <Ionicons name="close" size={22} color="#2f3542" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Date &amp; Time</Text>
              <Input className="h-11 rounded-xl bg-[#f3f3f5]" size="lg">
                <InputField placeholder="Select date and time" placeholderTextColor="#9ca3af" />
              </Input>
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
                <InputField placeholder="e.g., Spicy noodles, Coffee..." placeholderTextColor="#9ca3af" />
              </Input>
            </View>
          </ScrollView>

          <Box className="mt-5">
            <Button
              disabled={isSaveDisabled}
              className="h-12 rounded-xl bg-[#0c64ff]"
              style={isSaveDisabled ? styles.disabledButton : styles.enabledButton}
            >
              <ButtonText className="text-base font-semibold text-white opacity-80">
                Save Record
              </ButtonText>
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
