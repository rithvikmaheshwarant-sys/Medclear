// Legacy prototype backup. The active Expo app is in ./medclear/App.tsx.
// Keep this file for reference only; it is intentionally excluded from compilation.
// @ts-nocheck
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

type Screen = 'home' | 'login' | 'register' | 'patient' | 'doctor';
type Role = 'patient' | 'doctor';

type HistoryEntry = {
  id: string;
  date: string;
  description: string;
  source: string;
};

type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  allergies: string;
  doctorAccess: boolean;
  history: HistoryEntry[];
};

type Prescription = {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  instructions: string;
  doctor: string;
  date: string;
};

const demoPatients: Patient[] = [
  {
    id: 'MC-0001',
    name: 'Rahul Sharma (fictional)',
    dateOfBirth: '2002-05-14',
    bloodGroup: 'O+',
    allergies: 'Example allergy (unverified)',
    doctorAccess: false,
    history: [
      {
        id: 'H-1',
        date: '2026-09-15',
        description: 'Routine checkup — fictional demonstration record.',
        source: 'Sample record',
      },
    ],
  },
];

type ActionButtonProps = {
  title: string;
  onPress: () => void;
  secondary?: boolean;
};

function ActionButton({ title, onPress, secondary = false }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, secondary && styles.secondaryButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>
        {title}
      </Text>
    </Pressable>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [role, setRole] = useState<Role>('patient');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');

  const [patients, setPatients] = useState<Patient[]>(demoPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activePatientId, setActivePatientId] = useState('MC-0001');
  const [searchId, setSearchId] = useState('');
  const [doctorPatientId, setDoctorPatientId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [initialHistory, setInitialHistory] = useState('');
  const [newPatientNote, setNewPatientNote] = useState('');
  const [newDoctorNote, setNewDoctorNote] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');

  const activePatient = patients.find((p: Patient) => p.id === activePatientId);
  const doctorPatient = patients.find((p: Patient) => p.id === doctorPatientId);
  const today = () => new Date().toISOString().slice(0, 10);

  function openLogin(nextRole: Role) {
    setRole(nextRole);
    setLoginEmail('');
    setLoginPassword('');
    setMessage('');
    setScreen('login');
  }

  function demoLogin() {
    if (!loginEmail.includes('@') || loginPassword.length < 6) {
      setMessage('Use a fictional email and a password with at least 6 characters.');
      return;
    }
    // This is NOT authentication. Never use real credentials here.
    setLoginPassword('');
    setMessage('');
    setScreen(role);
  }

  function logout() {
    setLoginEmail('');
    setLoginPassword('');
    setMessage('');
    setDoctorPatientId(null);
    setScreen('home');
  }

  function registerPatient() {
    if (!name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dob) || !bloodGroup.trim()) {
      setMessage('Enter a name, date of birth (YYYY-MM-DD), and blood group.');
      return;
    }
    const id = `MC-${String(patients.length + 1).padStart(4, '0')}`;
    const patient: Patient = {
      id,
      name: name.trim(),
      dateOfBirth: dob,
      bloodGroup: bloodGroup.trim(),
      allergies: allergies.trim() || 'Not provided',
      doctorAccess: false,
      history: initialHistory.trim()
        ? [{
            id: `H-${Date.now()}`,
            date: today(),
            description: initialHistory.trim(),
            source: 'Patient reported (unverified)',
          }]
        : [],
    };
    setPatients((previous: Patient[]) => [...previous, patient]);
    setActivePatientId(id);
    setName('');
    setDob('');
    setBloodGroup('');
    setAllergies('');
    setInitialHistory('');
    setMessage('');
    setScreen('patient');
  }

  function toggleDoctorAccess() {
    setPatients((previous: Patient[]) => previous.map((p: Patient) =>
      p.id === activePatientId ? { ...p, doctorAccess: !p.doctorAccess } : p
    ));
  }

  function addHistory(patientId: string, description: string, source: string) {
    if (!description.trim()) {
      setMessage('Enter a medical history note first.');
      return;
    }
    setPatients((previous: Patient[]) => previous.map((p: Patient) =>
      p.id === patientId
        ? {
            ...p,
            history: [
              ...p.history,
              {
                id: `H-${Date.now()}`,
                date: today(),
                description: description.trim(),
                source,
              },
            ],
          }
        : p
    ));
    setMessage('History note added.');
  }

  function searchPatient() {
    const found = patients.find((p: Patient) => p.id.toUpperCase() === searchId.trim().toUpperCase());
    setDoctorPatientId(found?.id ?? null);
    setMessage(found ? '' : 'No matching fictional patient ID found.');
  }

  function addPrescription() {
    if (!doctorPatient || !doctorPatient.doctorAccess) {
      setMessage('The patient must grant demo doctor access first.');
      return;
    }
    if (!medication.trim() || !dosage.trim()) {
      setMessage('Enter the demo medicine name and dosage.');
      return;
    }
    setPrescriptions((previous: Prescription[]) => [
      ...previous,
      {
        id: `RX-${Date.now()}`,
        patientId: doctorPatient.id,
        medication: medication.trim(),
        dosage: dosage.trim(),
        instructions: instructions.trim() || 'None recorded',
        doctor: 'Demo Doctor',
        date: today(),
      },
    ]);
    setMedication('');
    setDosage('');
    setInstructions('');
    setMessage('Demo prescription saved.');
  }

  function historyList(patient: Patient) {
    return patient.history.length === 0 ? (
      <Text style={styles.muted}>No medical history notes yet.</Text>
    ) : (
      patient.history.map(entry => (
        <View key={entry.id} style={styles.item}>
          <Text style={styles.itemTitle}>{entry.date} · {entry.source}</Text>
          <Text style={styles.body}>{entry.description}</Text>
        </View>
      ))
    );
  }

  function prescriptionList(patientId: string) {
    const results = prescriptions.filter((p: Prescription) => p.patientId === patientId);
    return results.length === 0 ? (
      <Text style={styles.muted}>No prescriptions yet.</Text>
    ) : (
      results.map((rx: Prescription) => (
        <View key={rx.id} style={styles.item}>
          <Text style={styles.itemTitle}>{rx.medication} · {rx.dosage}</Text>
          <Text style={styles.body}>{rx.instructions}</Text>
          <Text style={styles.muted}>{rx.date} · {rx.doctor}</Text>
        </View>
      ))
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.logo}>✚ MedClear</Text>
        <Text style={styles.tagline}>Your Health, Connected.</Text>
        <Text style={styles.demoBadge}>FICTIONAL DATA · LOCAL DEMO ONLY</Text>
      </View>

      {screen === 'home' && (
        <View style={styles.card}>
          <Text style={styles.title}>One patient. One medical identity.</Text>
          <Text style={styles.muted}>
            Prototype medical profiles, history sharing, and digital prescriptions.
          </Text>
          <ActionButton title="Patient Login" onPress={() => openLogin('patient')} />
          <ActionButton title="Doctor Login" onPress={() => openLogin('doctor')} secondary />
          <Text style={styles.helper}>Try the patient flow first, then the doctor flow.</Text>
        </View>
      )}

      {screen === 'login' && (
        <View style={styles.card}>
          <Text style={styles.title}>{role === 'doctor' ? 'Doctor' : 'Patient'} Demo Login</Text>
          <Text style={styles.helper}>Use fake credentials, e.g. demo@medclear.test / Demo1234.</Text>
          <TextInput
            style={styles.input}
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder="Fictional email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={loginPassword}
            onChangeText={setLoginPassword}
            placeholder="Demo password"
            secureTextEntry
          />
          {message !== '' && <Text style={styles.error}>{message}</Text>}
          <ActionButton title="Continue to Demo" onPress={demoLogin} />
          {role === 'patient' && (
            <ActionButton title="Register Fictional Patient" secondary onPress={() => {
              setMessage('');
              setScreen('register');
            }} />
          )}
          <ActionButton title="Back" secondary onPress={logout} />
        </View>
      )}

      {screen === 'register' && (
        <View style={styles.card}>
          <Text style={styles.title}>Register a Demo Patient</Text>
          <Text style={styles.helper}>Do not enter real names, Aadhaar numbers, or medical records.</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Fictional full name" />
          <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="Date of birth (YYYY-MM-DD)" />
          <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} placeholder="Blood group (e.g. O+)" />
          <TextInput style={styles.input} value={allergies} onChangeText={setAllergies} placeholder="Allergies (fictional / unverified)" />
          <TextInput
            style={[styles.input, styles.multiline]}
            value={initialHistory}
            onChangeText={setInitialHistory}
            placeholder="Medical history (optional; patient-reported)"
            multiline
          />
          {message !== '' && <Text style={styles.error}>{message}</Text>}
          <ActionButton title="Create Demo Profile" onPress={registerPatient} />
          <ActionButton title="Back to Login" secondary onPress={() => {
            setMessage('');
            setScreen('login');
          }} />
        </View>
      )}

      {screen === 'patient' && activePatient && (
        <View style={styles.card}>
          <Text style={styles.title}>Patient Dashboard</Text>
          <Text style={styles.section}>My Profile</Text>
          <Text style={styles.body}>Name: {activePatient.name}</Text>
          <Text style={styles.body}>Patient ID: {activePatient.id}</Text>
          <Text style={styles.body}>DOB: {activePatient.dateOfBirth}</Text>
          <Text style={styles.body}>Blood group: {activePatient.bloodGroup}</Text>
          <Text style={styles.body}>Allergies: {activePatient.allergies}</Text>
          <Text style={styles.section}>Doctor Sharing Permission (Demo)</Text>
          <Text style={styles.muted}>
            {activePatient.doctorAccess
              ? 'Demo access granted. A doctor can view this profile in this app session.'
              : 'Access off. The doctor dashboard cannot display this medical record.'}
          </Text>
          <ActionButton
            title={activePatient.doctorAccess ? 'Revoke Doctor Access' : 'Grant Doctor Access'}
            onPress={toggleDoctorAccess}
          />
          <Text style={styles.section}>Medical History</Text>
          {historyList(activePatient)}
          <TextInput
            style={[styles.input, styles.multiline]}
            value={newPatientNote}
            onChangeText={setNewPatientNote}
            placeholder="Add a fictional patient-reported note"
            multiline
          />
          <ActionButton title="Add My History Note" secondary onPress={() => {
            if (newPatientNote.trim()) {
              addHistory(activePatient.id, newPatientNote, 'Patient reported (unverified)');
              setNewPatientNote('');
            } else setMessage('Enter a history note first.');
          }} />
          <Text style={styles.section}>My Prescriptions</Text>
          {prescriptionList(activePatient.id)}
          {message !== '' && <Text style={styles.helper}>{message}</Text>}
          <ActionButton title="Log Out" secondary onPress={logout} />
        </View>
      )}

      {screen === 'doctor' && (
        <View style={styles.card}>
          <Text style={styles.title}>Doctor Dashboard</Text>
          <Text style={styles.helper}>Search by demo patient ID. Sample: MC-0001.</Text>
          <TextInput
            style={styles.input}
            value={searchId}
            onChangeText={setSearchId}
            placeholder="Patient ID, e.g. MC-0001"
            autoCapitalize="characters"
          />
          <ActionButton title="Find Patient" onPress={searchPatient} />
          {doctorPatient && !doctorPatient.doctorAccess && (
            <Text style={styles.error}>
              Patient found, but sharing permission is off. Ask the patient to grant demo access.
            </Text>
          )}
          {doctorPatient && doctorPatient.doctorAccess && (
            <>
              <Text style={styles.section}>Authorized Patient Profile</Text>
              <Text style={styles.body}>{doctorPatient.name} · {doctorPatient.id}</Text>
              <Text style={styles.body}>DOB: {doctorPatient.dateOfBirth}</Text>
              <Text style={styles.body}>Blood group: {doctorPatient.bloodGroup}</Text>
              <Text style={styles.body}>Allergies (unverified): {doctorPatient.allergies}</Text>
              <Text style={styles.section}>Medical History</Text>
              {historyList(doctorPatient)}
              <TextInput
                style={[styles.input, styles.multiline]}
                value={newDoctorNote}
                onChangeText={setNewDoctorNote}
                placeholder="Fictional doctor visit note"
                multiline
              />
              <ActionButton title="Add Visit Note" secondary onPress={() => {
                if (newDoctorNote.trim()) {
                  addHistory(doctorPatient.id, newDoctorNote, 'Demo Doctor');
                  setNewDoctorNote('');
                } else setMessage('Enter a visit note first.');
              }} />
              <Text style={styles.section}>Write Demo Prescription</Text>
              <TextInput style={styles.input} value={medication} onChangeText={setMedication} placeholder="Example Medicine A" />
              <TextInput style={styles.input} value={dosage} onChangeText={setDosage} placeholder="Demo dosage / frequency" />
              <TextInput
                style={[styles.input, styles.multiline]}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Additional fictional instructions"
                multiline
              />
              <ActionButton title="Save Demo Prescription" onPress={addPrescription} />
              <Text style={styles.section}>Prescription History</Text>
              {prescriptionList(doctorPatient.id)}
            </>
          )}
          {message !== '' && <Text style={styles.helper}>{message}</Text>}
          <ActionButton title="Log Out" secondary onPress={logout} />
        </View>
      )}

      <Text style={styles.footer}>
        Hackathon prototype only. Everything resets when the app reloads. No backend or real authentication yet.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#F1F6FC',
    padding: 24,
    paddingTop: 44,
    alignItems: 'center',
  },
  header: { alignItems: 'center', marginBottom: 24, gap: 7 },
  logo: { fontSize: 35, fontWeight: '800', color: '#1666BB' },
  tagline: { color: '#536B82', fontSize: 15 },
  demoBadge: { color: '#865C11', fontSize: 11, fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 580,
    padding: 22,
    borderRadius: 18,
    gap: 12,
  },
  title: { color: '#17324D', fontSize: 23, fontWeight: '700', marginBottom: 3 },
  section: { color: '#1666BB', fontSize: 17, fontWeight: '700', marginTop: 10 },
  body: { color: '#263849', fontSize: 15, lineHeight: 22 },
  muted: { color: '#62748B', fontSize: 14, lineHeight: 21 },
  helper: { color: '#62748B', fontSize: 13, lineHeight: 20 },
  error: { color: '#B91C1C', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#CFD8E3',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 13,
    fontSize: 15,
    color: '#17324D',
  },
  multiline: { minHeight: 76, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#1666BB',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#BFD5F1',
  },
  secondaryButtonText: { color: '#1666BB' },
  item: {
    backgroundColor: '#F5F9FD',
    borderRadius: 10,
    padding: 12,
    gap: 5,
  },
  itemTitle: { color: '#20364A', fontSize: 14, fontWeight: '700' },
  footer: { color: '#7A8B9D', fontSize: 12, textAlign: 'center', marginTop: 20, maxWidth: 540 },
});
