import React, { useState, useCallback } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CategorySelect } from '../../components/CategorySelect';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDivider } from '../../components/ListDivider';
import { ListHeader } from '../../components/ListHeader';
import { Background } from '../../components/Background';
import { ButtonAdd } from '../../components/ButtonAdd';
import { Button } from '../../components/Button';
import { Profile } from '../../components/Profile';
import { Load } from '../../components/Load';

import { styles } from './styles';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';

export function Home() {
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

  const navigation = useNavigation();


  function handleCategorySelect(categoryId: string) {
    categoryId === category ? setCategory('') : setCategory(categoryId);
  } 
  
  function handleAppointmentDetails(guildSelected: AppointmentProps) {
    navigation.navigate('AppointmentDetails', { guildSelected });
  } 
  
  function handleAppointmentCreate() {
    navigation.navigate('AppointmentCreate');
  } 
  
  async function loadAppointments() {
    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if(category){
      setAppointments(storage.filter(item => item.category === category));
    }else{
      setAppointments(storage)
    }
    
    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadAppointments();
  },[category]));

  async function deleteAppointments() {
    await AsyncStorage.removeItem(COLLECTION_APPOINTMENTS);
  }

  async function handleDeleteAppointments() {
    Alert.alert('Exclus??o', 'Deseja realmente apagar todas as partidas agendadas?', [
      {
        text: 'N??o',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: () => {
          deleteAppointments();
          loadAppointments();
        }
      }
    ]);
  }

  return (
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate}/>
      </View>
    
      <CategorySelect 
        categorySelected={category}
        setCategory={handleCategorySelect}
      />
    
    {
      loading ? (
      <Load />
      ) : appointments.length < 1 ? (
        <ListHeader
          title={"Agende uma partida para come??ar!"}
        />
      ) : (
      <>
        <ListHeader 
          title="Partidas agendadas"
          subtitle={`Total ${appointments.length}`}
        />

        <FlatList 
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Appointment 
              data={item} 
              onPress={() => handleAppointmentDetails(item)}
            />            
          )}
          ItemSeparatorComponent={() => <ListDivider />}
          contentContainerStyle={{ paddingBottom: 69 }}
          style={styles.matches}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <Button
            title={"Excluir todas as partidas"}
            onPress={handleDeleteAppointments}
          />
        </View>

      </>
      )}
    </Background>
  );  
}