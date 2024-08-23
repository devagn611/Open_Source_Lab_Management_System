let patientData = []; // Store all patient data

function fetchPatientData() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (phoneNumber.length < 3) return; // Don't search until at least 3 digits are entered

    fetch('/api/patientData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            patientData = data; // Store all patient data
            const matchingPatients = data.filter(patient => patient.phoneNumber.includes(phoneNumber));
            updatePatientDropdown(matchingPatients);
        })
        .catch(error => console.error('Error:', error));
}

function updatePatientDropdown(patients) {
    const select = document.getElementById('patientSelect');
    const container = document.getElementById('patientSelectContainer');

    // Clear previous options
    select.innerHTML = '<option value="">Select a patient</option>';

    if (patients.length > 0) {
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.phoneNumber;
            option.textContent = `${patient.name} (${patient.email})`;
            select.appendChild(option);
        });
        container.style.display = 'block';
    } else {
        container.style.display = 'block'; // Show the form even if no matching patients
    }
}

function fillPatientData() {
    const selectedPhoneNumber = document.getElementById('patientSelect').value;
    const selectedPatient = patientData.find(patient => patient.phoneNumber === selectedPhoneNumber);

    if (selectedPatient) {
        document.getElementById('name').value = selectedPatient.name || '';
        document.getElementById('email').value = selectedPatient.email || '';
        document.getElementById('mobile').value = selectedPatient.phoneNumber || '';
        document.getElementById('age').value = selectedPatient.age || '';
        document.getElementById('gender').value = selectedPatient.gender || 'Select';
        document.getElementById('blood-group').value = selectedPatient.bloodGroup || 'Select';
        document.getElementById('allergies').value = selectedPatient.allergies || '';
        document.getElementById('medication').value = selectedPatient.medication || '';
        // Add any other fields you want to populate
    } else {
        // Clear the fields if no patient is selected
        ['name', 'email', 'mobile', 'age', 'gender', 'blood-group', 'allergies', 'medication'].forEach(field => {
            document.getElementById(field).value = '';
        });
        document.getElementById('gender').value = 'Select';
        document.getElementById('blood-group').value = 'Select';
    }
}
