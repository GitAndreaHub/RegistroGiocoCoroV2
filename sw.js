<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GiocoCoro V2</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
  <div id="root" class="max-w-xl mx-auto p-4"></div>

  <!-- React & Firebase SDK compat -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore-compat.js"></script>

  <!-- Firebase configuration -->
  <script>
    const firebaseConfig = {
      apiKey: "AIzaSyA4TzdjNP4roonlqd9Pz5Nebs7Q2xQjcOo",
      authDomain: "registro-giococoro-v2.firebaseapp.com",
      projectId: "registro-giococoro-v2",
      storageBucket: "registro-giococoro-v2.firebasestorage.app",
      messagingSenderId: "241025435819",
      appId: "1:241025435819:web:081adbe21b592a0eda8fee"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('🔥 Firebase initialized:', db);
  </script>

  <!-- App logic -->
  <script>
    const { useState, useEffect } = React;
    function App() {
      const [students, setStudents] = useState([]);
      const [newName, setNewName] = useState('');

      useEffect(() => {
        db.collection('students').get().then(snapshot => {
          const list = snapshot.docs.map(doc => doc.data().name);
          setStudents(list);
        });
      }, []);

      const addStudent = () => {
        const name = newName.trim();
        if (!name || students.includes(name)) return;
        db.collection('students').add({ name }).then(() => {
          setStudents(prev => [...prev, name]);
          setNewName('');
        });
      };

      const deleteStudent = (nameToDelete) => {
        db.collection('students').where('name', '==', nameToDelete).get().then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
          setStudents(prev => prev.filter(name => name !== nameToDelete));
        });
      };

      return React.createElement('div', {},
        React.createElement('h1', { className: 'text-2xl font-bold text-pink-600 mb-4' }, 'Registro Iscritti'),
        React.createElement('div', { className: 'flex gap-2 mb-4' },
          React.createElement('input', {
            type: 'text',
            value: newName,
            onChange: e => setNewName(e.target.value),
            placeholder: 'Nuovo iscritto',
            className: 'flex-1 p-2 border border-gray-300 rounded'
          }),
          React.createElement('button', {
            onClick: addStudent,
            className: 'bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600'
          }, 'Aggiungi')
        ),
        React.createElement('ul', { className: 'space-y-2' },
          students.map(name => React.createElement('li', {
            key: name,
            className: 'flex justify-between items-center bg-white p-3 shadow rounded'
          },
            React.createElement('span', null, name),
            React.createElement('button', {
              onClick: () => deleteStudent(name),
              className: 'text-red-500 hover:bg-red-100 px-2 py-1 rounded'
            }, '×')
          ))
        )
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  </script>
</body>
</html>
