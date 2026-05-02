import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TeamFlagProps {
  flag: string;
  size?: number;
}

export function TeamFlag({ flag, size = 32 }: TeamFlagProps) {
  return (
    <View style={[styles.container, { width: size + 8, height: size + 8 }]}>
      <Text style={{ fontSize: size }}>{flag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    overflow: "hidden",
  },
});
