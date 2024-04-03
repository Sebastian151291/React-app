import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function MyDateTimePicker({ isVisible, onDateChange, onClose }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    onDateChange(currentDate);
  };

  const hideDatePicker = () => {
    onClose();
  };

  const onConfirm = (selectedDate) => {
    hideDatePicker();
    const formattedTime = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTime(formattedTime);
    onDateChange(selectedDate); // Add this line to update the date in the parent component
  };

  return (
    <View>
      <Button onPress={hideDatePicker} title="Hide date picker!" />
      <DateTimePickerModal
        testID="dateTimePicker"
        isVisible={isVisible}
        value={date}
        mode="datetime"
        is24Hour={true}
        display="default"
        onChange={onChange}
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    </View>
  );
}
