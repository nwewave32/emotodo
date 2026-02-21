import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import { messages } from '../constants/messages';

interface ReasonPickerProps {
  selectedReason: string | null;
  onSelect: (reason: string) => void;
  reasonNote: string;
  onReasonNoteChange: (text: string) => void;
}

export const ReasonPicker: React.FC<ReasonPickerProps> = ({
  selectedReason,
  onSelect,
  reasonNote,
  onReasonNoteChange,
}) => {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    reasonsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    reasonButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.cardElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reasonButtonSelected: {
      backgroundColor: colors.primaryMuted,
      borderColor: colors.primary,
    },
    reasonLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    reasonLabelSelected: {
      color: colors.primary,
      fontWeight: '500',
    },
    reasonNoteInput: {
      marginTop: 12,
      backgroundColor: colors.cardElevated,
      borderRadius: 12,
      padding: 14,
      fontSize: 14,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 60,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{messages.questions.whyNotComplete}</Text>
      <View style={styles.reasonsGrid}>
        {messages.reasons.map((reason) => (
          <TouchableOpacity
            key={reason.key}
            style={[
              styles.reasonButton,
              selectedReason === reason.key && styles.reasonButtonSelected,
            ]}
            onPress={() => onSelect(reason.key)}
          >
            <Text
              style={[
                styles.reasonLabel,
                selectedReason === reason.key && styles.reasonLabelSelected,
              ]}
            >
              {reason.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reasonNoteInput}
        value={reasonNote}
        onChangeText={onReasonNoteChange}
        placeholder={messages.placeholders.reasonNote}
        placeholderTextColor={colors.textLight}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        maxLength={500}
      />
    </View>
  );
};
