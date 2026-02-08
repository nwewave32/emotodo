import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';

interface ReasonPickerProps {
  selectedReason: string | null;
  onSelect: (reason: string) => void;
}

export const ReasonPicker: React.FC<ReasonPickerProps> = ({
  selectedReason,
  onSelect,
}) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonButtonSelected: {
    backgroundColor: colors.primaryLight,
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
});
