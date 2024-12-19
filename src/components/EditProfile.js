import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/EditProfile.css";

function Records() {
  const [profiles, setProfiles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    profile_id: "",
    name: "",
    course: "",
    year: "",
    email: "",
    contact: "",
    address: "",
    birthdate: "",
    ambition: "",
  });

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/records");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleEditClick = (profile) => {
    setEditedProfile(profile);
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/records/${editedProfile.profile_id}`, editedProfile);
      // Update profiles state after successful update
      const updatedProfiles = profiles.map((profile) =>
        profile.profile_id === editedProfile.profile_id ? editedProfile : profile
      );
      setProfiles(updatedProfiles);
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="records-container">
      <h2>Records</h2>

      {editMode ? (
        <div className="edit-form">
          <h3>Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Course:
              <input
                type="text"
                name="course"
                value={editedProfile.course}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Year:
              <input
                type="text"
                name="year"
                value={editedProfile.year}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Contact:
              <input
                type="text"
                name="contact"
                value={editedProfile.contact}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={editedProfile.address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Birthdate:
              <input
                type="date"
                name="birthdate"
                value={editedProfile.birthdate}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Ambition:
              <input
                type="text"
                name="ambition"
                value={editedProfile.ambition}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Year</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Birthdate</th>
              <th>Ambition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.profile_id}>
                <td>{profile.name}</td>
                <td>{profile.course}</td>
                <td>{profile.year}</td>
                <td>{profile.email}</td>
                <td>{profile.contact}</td>
                <td>{profile.address}</td>
                <td>{profile.birthdate || "N/A"}</td>
                <td>{profile.ambition || "N/A"}</td>
                <td>
                  <button onClick={() => handleEditClick(profile)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Records;
