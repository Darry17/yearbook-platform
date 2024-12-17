import React, { useState, useEffect } from "react";
import axios from "axios";

function YearbookBatches() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    // Fetch yearbook batches on load
    axios
      .get("http://localhost:5000/api/yearbook-batches")
      .then((res) => setBatches(res.data))
      .catch((err) => console.error("Error fetching batches:", err));
  }, []);

  const handleBatchClick = (batch) => {
    setSelectedBatch(batch);
    setSelectedDesignation(null); // Reset designation selection
    setAlumni([]); // Clear alumni list
  };

  const handleDesignationClick = (designation) => {
    setSelectedDesignation(designation);

    // Fetch alumni by batch and designation
    axios
      .get(`http://localhost:5000/api/yearbook-batch/${selectedBatch.batch_id}`)
      .then((res) => {
        const filteredAlumni = res.data.filter(
          (alumnus) => alumnus.batch_type === designation
        );
        setAlumni(filteredAlumni);
      })
      .catch((err) => console.error("Error fetching alumni:", err));
  };

  return (
    <div>
      <h2>Yearbook Batches</h2>
      {!selectedBatch && (
        <ul>
          {batches.map((batch) => (
            <li key={batch.batch_id} onClick={() => handleBatchClick(batch)}>
              {batch.batch_year_range}
            </li>
          ))}
        </ul>
      )}

      {selectedBatch && !selectedDesignation && (
        <div>
          <h3>{selectedBatch.batch_year_range}</h3>
          <button onClick={() => handleDesignationClick("Regular")}>
            Regular
          </button>
          <button onClick={() => handleDesignationClick("Mid-Year")}>
            Mid-Year
          </button>
          <button onClick={() => setSelectedBatch(null)}>Back</button>
        </div>
      )}

{selectedDesignation && (
  <div>
    <h3>
      {selectedBatch.batch_year_range} - {selectedDesignation}
    </h3>
    <ul>
      {alumni.map((alumnus) => (
        <li key={alumnus.profile_id}>
          <strong>Name:</strong> {alumnus.name} <br />
          <strong>Address:</strong> {alumnus.address || "N/A"} <br />
          <strong>Birthdate:</strong> {alumnus.birthdate} <br />
          <strong>Ambition:</strong> {alumnus.ambition || "N/A"}
        </li>
      ))}
    </ul>
    <button onClick={() => setSelectedDesignation(null)}>Back</button>
  </div>
)}

    </div>
  );
}

export default YearbookBatches;
