import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, SafeAreaView } from 'react-native';

const API_BASE = 'http://<your_backend_ip>:3000'; // Replace with your actual IP

export default function App() {
  const [distance, setDistance] = useState(0);
  const [led, setLed] = useState(false);
  const [buzzer, setBuzzer] = useState(false);

  // Fetch initial control state
  useEffect(() => {
    fetch(`${API_BASE}/control`)
      .then((res) => res.json())
      .then((data) => {
        setLed(data.led);
        setBuzzer(data.buzzer);
      })
      .catch((err) => console.error('Initial control state fetch error:', err));
  }, []);

  // Fetch distance every second
  useEffect(() => {
    const fetchDistance = setInterval(() => {
      fetch(`${API_BASE}/distance`)
        .then((res) => res.json())
        .then((data) => {
          setDistance(data.distance);
        })
        .catch((err) => {
          console.error('Distance fetch error:', err);
        });
    }, 1000);

    return () => clearInterval(fetchDistance);
  }, []);

  // Send control data
  const toggleControl = () => {
    fetch(`${API_BASE}/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ led, buzzer }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update controls');
        }
        console.log('Updated controls');
      })
      .catch((err) => {
        console.error('Control update error:', err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>SmartHome Controller</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.distance}>{distance} cm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>LED</Text>
        <Switch value={led} onValueChange={(value) => setLed(value)} />

        <Text style={[styles.label, { marginTop: 16 }]}>Buzzer</Text>
        <Switch value={buzzer} onValueChange={(value) => setBuzzer(value)} />

        <View style={{ marginTop: 24 }}>
          <Button title="Apply Changes" onPress={toggleControl} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f8',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#444',
  },
  distance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0a84ff',
  },
});
