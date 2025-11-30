import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Logger from "../utils/Logger";
import { BASE_URL, testConnection } from "../services/api";

const DebugPanel = ({ visible, onClose }) => {
  const [logs, setLogs] = useState([]);

  const refreshLogs = () => {
    setLogs([...Logger.getLogs()]);
  };

  useEffect(() => {
    if (visible) {
      refreshLogs();
      const interval = setInterval(refreshLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [visible]);

  const handleTestConnection = async () => {
    await testConnection();
    refreshLogs();
  };

  const handleClearLogs = () => {
    Logger.clear();
    refreshLogs();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Debug Panel</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Current BASE_URL:</Text>
          <Text style={styles.value}>{BASE_URL}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={handleTestConnection}
          >
            <Text style={styles.buttonText}>Test Connection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClearLogs}
          >
            <Text style={styles.buttonText}>Clear Logs</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.logsContainer}>
          {logs.map((log) => (
            <View key={log.id} style={styles.logEntry}>
              <View style={styles.logHeader}>
                <Text style={styles.timestamp}>{log.timestamp}</Text>
                <Text
                  style={[
                    styles.type,
                    log.type === "error" ? styles.errorType : styles.infoType,
                  ]}
                >
                  {log.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.message}>{log.message}</Text>
              {log.data && <Text style={styles.data}>{log.data}</Text>}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: "#ff4444",
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#2a2a2a",
  },
  label: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: "#00ff00",
    fontSize: 14,
    fontFamily: "monospace",
  },
  actions: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  testButton: {
    backgroundColor: "#007AFF",
  },
  clearButton: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logsContainer: {
    flex: 1,
    padding: 16,
  },
  logEntry: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 8,
  },
  logHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
    marginRight: 8,
  },
  type: {
    fontSize: 12,
    fontWeight: "bold",
  },
  infoType: {
    color: "#00ff00",
  },
  errorType: {
    color: "#ff4444",
  },
  message: {
    color: "#fff",
    fontSize: 14,
  },
  data: {
    color: "#aaa",
    fontSize: 12,
    fontFamily: "monospace",
    marginTop: 4,
  },
});

export default DebugPanel;
