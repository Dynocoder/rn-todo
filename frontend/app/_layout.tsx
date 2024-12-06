import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import CheckBox from "@react-native-community/checkbox";

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface TodoItem {
  title: string;
  completed: boolean;
}


export default function RootLayout() {

  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const response = await axios.get<TodoItem[]>(`${API_URL}/load`);
      setTodoItems(response.data);
    } catch (error) {
      console.error("Error loading TODOs:", error);
    }
  };

  const saveTodos = async () => {
    try {
      const saveObj = {
        "todo_list": todoItems
      }
      await axios.post(`${API_URL}/save`, saveObj);
      alert("TODOs saved successfully!");
    } catch (error) {
      console.error("Error saving TODOs:", error);
    }
  };

  const clearTodos = async () => {
    try {
      await axios.get(`${API_URL}/clear`);
      setTodoItems([]);
      alert("TODOs cleared successfully!");
    } catch (error) {
      console.error("Error clearing TODOs:", error);
    }
  };

  const handleAdd = () => {
    setTodoItems([...todoItems, { title: inputText, completed: false }]);
    setInputText("");
  };

  const handleEdit = () => {
    if (editingIndex !== null) {
      const updatedItems = [...todoItems];
      updatedItems[editingIndex].title = inputText;
      setTodoItems(updatedItems);
      setInputText("");
      setIsEditing(false);
      setEditingIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    setTodoItems(todoItems.filter((_, i) => i !== index));
  };

  const toggleComplete = (index: number) => {
    const updatedItems = [...todoItems];
    updatedItems[index].completed = !updatedItems[index].completed;
    setTodoItems(updatedItems);
  };

  const initiateEdit = (index: number) => {
    setInputText(todoItems[index].title);
    setIsEditing(true);
    setEditingIndex(index);
  };



  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={saveTodos}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={loadTodos}>
            <FontAwesome name="refresh" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={clearTodos}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter TODO title"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.button} onPress={isEditing ? handleEdit : handleAdd}>
            <Text style={styles.buttonText}>{isEditing ? "Edit" : "Add"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TODO List */}
      {todoItems.length > 0 && (
        <FlatList
          style={styles.todoList}
          data={todoItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.todoItem}>
              {/* Checkbox Icon */}
              <TouchableOpacity onPress={() => toggleComplete(index)}>
                {item.completed ? (
                  <FontAwesome name="check-square" size={24} color="green" />
                ) : (
                  <FontAwesome name="square-o" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text
                style={[
                  styles.todoText,
                  item.completed && styles.completedTodoText,
                ]}
              >
                {item.title}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => initiateEdit(index)}>
                  <FontAwesome name="edit" size={18} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <FontAwesome name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5"
  },
  header: {
    marginBottom: 20,
    marginHorizontal: "auto",
    width: '70%',
    display: 'flex',
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 15,
    width: "40%",
  },

  buttonRow: {
    marginBottom: 15,
    padding: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
    alignItems: "flex-start",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold"
  },
  todoList: {
    marginHorizontal: "auto",
    width: "70%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  todoText: {
    fontSize: 18,
    flex: 1
  },
  completedTodoText: {
    fontSize: 18,
    textDecorationLine: "line-through",
    color: "gray",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6200ee",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#6200ee",
  },
});
