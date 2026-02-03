import React, {useState} from 'react';
import {StatusBar, Modal} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DDayProvider} from './src/contexts/DDayContext';
import HomeScreen from './src/screens/HomeScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import {DDayEvent} from './src/types';

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DDayEvent | undefined>();

  const handleAddPress = () => {
    setEditingEvent(undefined);
    setShowAddModal(true);
  };

  const handleEventPress = (event: DDayEvent) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEvent(undefined);
  };

  return (
    <SafeAreaProvider>
      <DDayProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        <HomeScreen
          onAddPress={handleAddPress}
          onEventPress={handleEventPress}
        />
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet">
          <AddEventScreen
            onClose={handleCloseModal}
            editEvent={editingEvent}
          />
        </Modal>
      </DDayProvider>
    </SafeAreaProvider>
  );
}

export default App;
