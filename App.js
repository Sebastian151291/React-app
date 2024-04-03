import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Animated, TextInput, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MyDateTimePicker from './MyDateTimePicker'; // Adjust the path based on your project structure


export default function App() {
  const [reminderText, setReminderText] = useState('Upcoming Work');
  const [filter, setFilter] = useState('All');
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const translateY = new Animated.Value(500);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});

  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", priority: "MEDIUM", status: "Upcoming", description:   "Upcoming Task", time: "08:00 AM" },
    { id: 2, title: "Task 2", priority: "HIGH", status: "Completed", description: "Completed Task" , time: "08:00 AM" },
    { id: 3, title: "Task 3", priority: "LOW", status: "Overdue", description: "Overdue Task", time: "08:00 AM" },
    { id: 4, title: "Task 4", priority: "URGENT", status: "Canceled", description: "Overdue Task", time: "08:00 AM" },
  ]);

  useEffect(() => {
    setTasksByDate({
      [formatDate(selectedDate)]: tasks,
    });
    handleDateChange(selectedDate); // Add this line to update sortedTasks initially
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };


  const [sortedTasks, setSortedTasks] = useState([...tasks]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Choose Priority:');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [priorityDropdownVisible, setPriorityDropdownVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);


  useEffect(() => {
    filterTasks();
  }, [filter]);

  const filterTasks = () => {
    if (filter === 'Ongoing') {
      const ongoingTasks = tasks.filter(task => task.status === 'Upcoming' || task.status === 'Completed');
      setSortedTasks([...ongoingTasks]);
      setReminderText('Upcoming Work');
    } else if (filter === 'Overdue') {
      const overdueTasks = tasks.filter(task => task.status === 'Overdue' || task.status === 'Canceled');
      setSortedTasks([...overdueTasks]);
      setReminderText('Overdue Work');
    } else if (filter === 'All') {
      const allTasks = tasks.filter(task => task.status === task.status === 'Upcoming' || task.status === 'Completed' || 'Overdue' || task.status === 'Canceled');
      setSortedTasks([...allTasks]);
      setReminderText('All Tasks');
    }
  };

  const handleButtonPress = (buttonType) => {
    console.log(`${buttonType} Button Pressed!`);
    if (buttonType === 'Overdue' || buttonType === 'Ongoing' || buttonType === 'All') {
      setFilter(buttonType);
    } else if (buttonType === 'Add Task') {
      setAddEditModalVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (buttonType === 'Sort & Filter') {
      setSortModalVisible(true);
    } else if (buttonType === 'Add Notes') {
      setDatePickerVisibility(true);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  
    if (!tasksByDate[date]) {
      setTasksByDate((prevTasksByDate) => ({
        ...prevTasksByDate,
        [date]: [], // Initialize tasks for the new date
      }));
    }
    // Filter tasks based on the selected date
    const filteredTasks = tasksByDate[date] || [];
    setSortedTasks([...filteredTasks]);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const addNewTask = () => {
    const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = {
      id: newId,
      title: newTaskTitle,
      priority: newTaskPriority,
      description: newTaskDescription,
      status: "Upcoming",
    };
    setTasks([...tasks, newTask]);
    closeModal();
    setNewTaskTitle('');
    setNewTaskPriority('Choose Priority:');
    setNewTaskDescription('');
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && task.status === 'Upcoming') {
        return { ...task, status: 'Completed' };
      }
      return task;
    });
    setTasks(updatedTasks);
    setAddEditModalVisible(false);
  };

  const overdueTask = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && task.status === 'Upcoming') {
        return { ...task, status: 'Overdue' };
      }
      return task;
    });
    setTasks(updatedTasks);
    setAddEditModalVisible(false);
  };

  const cancelTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId && task.status === 'Upcoming') {
        return { ...task, status: "Canceled" };
      }
      return task;
    });
    setTasks(updatedTasks);
    setDeleteModalVisible(false);
    setAddEditModalVisible(false);
  };
  
  const deleteTask = (taskId) => {
    // Remove the task with the specified taskId
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  
    // Close the modal after deleting the task
    setDeleteModalVisible(false);
    setAddEditModalVisible(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    filterTasks();
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'darkorange';
      case 'HIGH': return 'magenta';
      case 'MEDIUM': return 'blue';
      case 'LOW': return 'lightgreen';
      default: return 'grey';
    }
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setAddEditModalVisible(false);
      setSelectedTask(null);
    });
  };

  const handleTaskPress = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    
    if (task.status !== 'Unknown' ) {
      setSelectedTask(taskId);
      setAddEditModalVisible(true);
      setNewTaskTitle('');
      setNewTaskPriority('Choose Priority:');  
      setNewTaskDescription('');
    }
  };

  const renderTaskStatus = (status) => {
    switch (status) {
      case 'Upcoming':
        return <Text style={styles.taskStatusUpcoming}>{status}</Text>;
      case 'Completed':
        return <Text style={styles.taskStatusCompleted}>{status}</Text>;
      case 'Canceled':
        return <Text style={styles.taskStatusCanceled}>{status}</Text>;
      case 'Overdue':
        return <Text style={styles.taskStatusOverdue}>{status}</Text>;
      default:
        return null;
    }
  };

  const renderTasksForDate = (date) => {
    const tasks = tasksByDate[date] || [];
    return tasks.map((task) => (
      <TouchableOpacity
        key={task.id}
        style={styles.task}
        onPress={() => handleTaskPress(task.id)}
      >
        {/* ... existing task rendering code ... */}
        <Text style={styles.taskTime}>{task.time}</Text>
      </TouchableOpacity>
    ));
  };

  const sortTasksByPriority = () => {
    const priorityOrder = { URGENT: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    
    let tasksToSort = sortedTasks; // Use sortedTasks instead of all tasks
    
    // Check the filter to determine which tasks to sort
    if (filter === 'Ongoing') {
      tasksToSort = tasksToSort.filter(task => task.status === 'Upcoming' || task.status === 'Completed');
    } else if (filter === 'Overdue') {
      tasksToSort = tasksToSort.filter(task => task.status === 'Overdue' || task.status === 'Canceled');
    }
    
    const sorted = [...tasksToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    setSortedTasks(sorted);
  };

  const sortTasksByAntipriority = () => {
    const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };
    
    let tasksToSort = sortedTasks; // Use sortedTasks instead of all tasks
    
    // Check the filter to determine which tasks to sort
    if (filter === 'Ongoing') {
      tasksToSort = tasksToSort.filter(task => task.status === 'Upcoming' || task.status === 'Completed');
    } else if (filter === 'Overdue') {
      tasksToSort = tasksToSort.filter(task => task.status === 'Overdue' || task.status === 'Canceled');
    }
    
    const sorted = [...tasksToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    setSortedTasks(sorted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleButtonPress('Ongoing')}>
          <Text style={styles.headerText}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonPress('All')}>
          <Text style={styles.headerText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonPress('Overdue')}>
          <Text style={styles.headerText}>Overdue</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reminderZone}>
        <Text style={styles.reminderText}>{reminderText}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.taskList}>
        {sortedTasks.map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.task}
              onPress={() => handleTaskPress(task.id)}
            >
              <View style={styles.taskTitle}>
                <Text style={styles.taskTitleText}>{task.title}</Text>
                {renderTaskStatus(task.status)}
                <View style={[styles.priorityButton, { backgroundColor: getPriorityColor(task.priority) }]}>
                  <Text style={styles.priorityButtonText}>{task.priority}</Text>
                </View>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleButtonPress('Add Task')}
          activeOpacity={0.3}
        >
          <Image source={require('./assets/1.png')} style={styles.footerButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleButtonPress('Sort & Filter')}
          activeOpacity={0.3}
        >
          <Image source={require('./assets/2.png')} style={styles.footerButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleButtonPress('Add Notes')}
          activeOpacity={0.3}
        >
          <Image source={require('./assets/3.png')} style={styles.footerButtonIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Sort by Priority</Text> 
            <TouchableOpacity onPress={() => sortTasksByPriority() & setSortModalVisible(false)}>
              <Text style={styles.Sorting1Button}>High-to-Low</Text>
            </TouchableOpacity>            
            <TouchableOpacity onPress={() => sortTasksByAntipriority() & setSortModalVisible(false)}>
              <Text style={styles.Sorting2Button}>Low-to-High</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={addEditModalVisible}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{selectedTask ? 'Change Status' : 'Add Task'}</Text>
            {!selectedTask && (
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={selectedTask ? tasks.find(task => task.id === selectedTask).title : newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            )}
            {!selectedTask && (
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setPriorityDropdownVisible(!priorityDropdownVisible)}
            >
              <Text>
                {selectedTask
                  ? tasks.find(task => task.id === selectedTask).priority
                  : newTaskPriority}
              </Text>
            </TouchableOpacity>
            )}
            {priorityDropdownVisible && !selectedTask && (
              <View style={styles.dropdown}>
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewTaskPriority(priority);
                      setPriorityDropdownVisible(false);
                    }}
                  >
                    <Text>{priority}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {!selectedTask && (
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTaskDescription}
              defaultValue={
                selectedTask
                  ? tasks.find(task => task.id === selectedTask).description
                  : newTaskDescription
              }
              onChangeText={setNewTaskDescription}
            />
            )}
              
            {selectedTask && (
              <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
                <Text style={styles.deleteButton}>Delete Task</Text>
              </TouchableOpacity>
            )}

            {selectedTask && tasks.find(task => task.id === selectedTask).status === 'Upcoming' && (
              <TouchableOpacity onPress={() => completeTask(selectedTask)}>
                <Text style={styles.doneButton}>Done!</Text>
              </TouchableOpacity>
            )}

            {selectedTask && tasks.find(task => task.id === selectedTask).status === 'Upcoming' && (
              <TouchableOpacity onPress={() => overdueTask(selectedTask)}>
                <Text style={styles.overdueButton}>Too Late...</Text>
              </TouchableOpacity>
            )}

            {selectedTask && tasks.find(task => task.id === selectedTask).status === 'Upcoming' && (
              <TouchableOpacity onPress={() => cancelTask(selectedTask)}>
                <Text style={styles.canceledButton}>Throw Away</Text>
              </TouchableOpacity>
            )}

            {!selectedTask && (
            <TouchableOpacity onPress={addNewTask}>
              <Text style={styles.saveButton}>
                {selectedTask ? 'Edit Task' : 'Save Task'}
              </Text>
            </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => closeModal()}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Give up Task</Text>
            <Text style={styles.deleteWarningText}>Are you sure you want to delete this task?</Text>
            <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(selectedTask)}>
              <Text style={styles.deleteButton}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={isDatePickerVisible}
        onRequestClose={hideDatePicker}
      >
        <View style={styles.modalContainer}>
          <MyDateTimePicker
            isVisible={isDatePickerVisible}
            onDateChange={handleDateChange}
            onClose={hideDatePicker}
          />
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  reminderZone: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ff0',
    borderRadius: 10,
    marginBottom: 10,
  },
  reminderText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskList: {
    width: '100%', // Set the task list width to 100%
  },
  task: {
    width: 370,
    height: 150,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,  // Add left border for separation
    borderColor: '#3498db',  // Border color
  },
  taskTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  taskTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 10,
    flex: 1,
  },
  taskTags: {
    flexDirection: 'row',
    height: 30,
  },
  taskTag: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 0.5,
    borderColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 10,
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  footerButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 0,
    width: '33.3%',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    color: 'white',
  },
  priorityButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  priorityButtonText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  Sorting1Button: {
    backgroundColor: 'orange',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  Sorting2Button: {
    backgroundColor: 'green',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'grey',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'green',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 10,
  },
  deleteWarningText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'red',
  },
  canceledButton: {
    backgroundColor: 'darkorange',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  doneButton: {
    backgroundColor: 'green',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  overdueButton: {
    backgroundColor: 'purple',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'grey',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 10,
  },
  taskStatusUpcoming: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: 'green',
  },
  taskStatusCompleted: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: 'darkorange',
  },
  taskStatusCanceled: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: 'red',
  },
  taskStatusOverdue: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: 'magenta',
  },
});
