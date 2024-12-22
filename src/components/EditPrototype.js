import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [profiles, setProfiles] = useState([]);
  const [editProfile, setEditProfile] = useState({
    profile_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    course: '',
    email: '',
    contact_number: '',
    birthdate: '',
    ambition: '',
  });

  // Fetch profiles
  useEffect(() => {
    axios.get('http://localhost:5000/profiles')
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (profile_id) => {
    const sanitizedEditProfile = {
      profile_id: editProfile.profile_id,
      first_name: editProfile.first_name || '',
      middle_name: editProfile.middle_name || '',
      last_name: editProfile.last_name || '',
      course: editProfile.course || '',
      email: editProfile.email || '',
      contact_number: editProfile.contact_number || '',
      birthdate: editProfile.birthdate || '',
      ambition: editProfile.ambition || '',
    };

    axios.put(`http://localhost:5000/profiles/${profile_id}`, sanitizedEditProfile)
      .then(() => {
        setProfiles((prev) =>
          prev.map((profile) =>
            profile.profile_id === profile_id ? { ...profile, ...sanitizedEditProfile } : profile
          )
        );
        setEditProfile({
          profile_id: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          course: '',
          email: '',
          contact_number: '',
          birthdate: '',
          ambition: '',
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Yearbook Profiles</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Middlename</th>
            <th>Lastname</th>
            <th>Course</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Birthdate</th>
            <th>Ambition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.profile_id}>
              {['first_name', 'middle_name', 'last_name', 'course', 'email', 'contact_number', 'birthdate', 'ambition'].map(
                (field) => (
                  <td key={field}>
                    {editProfile.profile_id === profile.profile_id ? (
                      <input
                        type="text"
                        name={field}
                        value={editProfile[field] || ''}
                        onChange={handleEditChange}
                      />
                    ) : (
                      profile[field]
                    )}
                  </td>
                )
              )}
              <td>
                {editProfile.profile_id === profile.profile_id ? (
                  <button onClick={() => handleEditSubmit(profile.profile_id)}>Save</button>
                ) : (
                  <button
                    onClick={() =>
                      setEditProfile({
                        profile_id: profile.profile_id,
                        first_name: profile.first_name,
                        middle_name: profile.middle_name,
                        last_name: profile.last_name,
                        course: profile.course,
                        email: profile.email,
                        contact_number: profile.contact_number,
                        birthdate: profile.birthdate,
                        ambition: profile.ambition,
                      })
                    }
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
