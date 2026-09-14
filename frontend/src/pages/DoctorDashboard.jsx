import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // PATIENT ID
  // =====================================================

  const getPatientId = (patient, index) => {
    return String(patient.id || patient._id || index);
  };

  // =====================================================
  // VIEWED STATUS
  // =====================================================

  const isViewed = (patient) => {
    return patient.viewed === true;
  };

  // =====================================================
  // MARK PATIENT AS VIEWED
  // =====================================================

  // =====================================================
  // MARK PATIENT AS VIEWED
  // =====================================================

  const markAsViewed = (patient, index) => {
    const id = getPatientId(patient, index);

    // Show popup IMMEDIATELY
    alert("Patient marked as viewed ✓");

    // Update UI immediately
    setPatients((currentPatients) =>
      currentPatients.map((item, itemIndex) => {
        const itemId = getPatientId(item, itemIndex);

        if (itemId === id) {
          return {
            ...item,
            viewed: true,
          };
        }

        return item;
      }),
    );

    // Update database in background
    fetch(`http://127.0.0.1:8000/patients/${id}/viewed`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        viewed: true,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.detail || "Failed to mark patient as viewed");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Patient marked as viewed in database:", data);
      })
      .catch((error) => {
        // Background error only
        console.error("Background Mark Viewed Error:", error);
      });
  };

  // =====================================================
  // FETCH PATIENTS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function loadPatients() {
      try {
        const response = await fetch("http://127.0.0.1:8000/patients");

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) return;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.patients)
            ? data.patients
            : [];

        setPatients(list);
        setError("");
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        console.error("Dashboard fetch error:", err);

        setError(err.message || "Unable to load patient records.");

        setLoading(false);
      }
    }

    loadPatients();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/patients");

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.patients)
          ? data.patients
          : [];

      setPatients(list);
    } catch (err) {
      console.error("Refresh error:", err);

      setError(err.message || "Unable to load patient records.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const searchPatient = (patient) => {
    const text = search.toLowerCase().trim();

    if (!text) {
      return true;
    }

    return (
      String(patient.name || "")
        .toLowerCase()
        .includes(text) ||
      String(patient.phone || "")
        .toLowerCase()
        .includes(text) ||
      String(patient.main_problem || patient.mainProblem || "")
        .toLowerCase()
        .includes(text)
    );
  };

  // =====================================================
  // NEW PATIENTS
  // =====================================================

  const newPatients = patients.filter((patient) => !isViewed(patient));

  // =====================================================
  // PREVIOUS PATIENTS
  // =====================================================

  const previousPatients = patients.filter((patient) => isViewed(patient));

  const filteredNewPatients = newPatients.filter(searchPatient);

  const filteredPreviousPatients = previousPatients.filter(searchPatient);

  // =====================================================
  // REPORT COUNT
  // =====================================================

  const reportCount = patients.filter((patient) => patient.reports).length;

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const openProfile = (patient, index) => {
    const id = getPatientId(patient, index);

    navigate(`/patient/${id}`);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="doctor-dashboard">
      {/* HEADER */}

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">✚</div>

          <div>
            <h1>MediKiosk</h1>
            <p>Doctor Dashboard</p>
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={refreshPatients}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <main className="dashboard-content">
        {/* WELCOME */}

        <section className="dashboard-welcome">
          <span className="dashboard-badge">Healthcare Management</span>

          <h2>Patient Overview</h2>

          <p>Review new patient records and manually mark them as viewed.</p>
        </section>

        {/* STATS */}

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>

            <div>
              <span>Total Patients</span>

              <strong>{patients.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🆕</div>

            <div>
              <span>New Patients</span>

              <strong>{newPatients.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📄</div>

            <div>
              <span>Medical Reports</span>

              <strong>{reportCount}</strong>
            </div>
          </div>
        </section>

        {/* NEW PATIENTS */}

        <section className="patients-section">
          <div className="patients-header">
            <div>
              <h2>New Patient Records</h2>

              <p>
                {filteredNewPatients.length} new patient
                {filteredNewPatients.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="patient-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="dashboard-state">
              <div className="loading-spinner"></div>

              <p>Loading patient records...</p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="dashboard-error">
              <div className="error-icon">!</div>

              <h3>Unable to load records</h3>

              <p>{error}</p>

              <button className="retry-btn" onClick={refreshPatients}>
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}

          {!loading && !error && filteredNewPatients.length === 0 && (
            <div className="dashboard-empty">
              <div className="empty-icon">✓</div>

              <h3>All caught up!</h3>

              <p>No new patients are waiting for review.</p>
            </div>
          )}

          {/* NEW PATIENT TABLE */}

          {!loading && !error && filteredNewPatients.length > 0 && (
            <div className="patient-table-wrapper">
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Main Problem</th>
                    <th>Severity</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNewPatients.map((patient) => {
                    const index = patients.indexOf(patient);

                    const id = getPatientId(patient, index);

                    return (
                      <tr key={id}>
                        <td>
                          <div className="patient-name-cell">
                            <div className="patient-avatar">
                              {String(patient.name || "P")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>{patient.name || "Unknown"}</strong>

                              <span>New Patient</span>
                            </div>
                          </div>
                        </td>

                        <td>{patient.age || "—"}</td>

                        <td>{patient.gender || "—"}</td>

                        <td>{patient.phone || "—"}</td>

                        <td>
                          <span className="problem-text">
                            {patient.main_problem ||
                              patient.mainProblem ||
                              "Not provided"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`severity-badge ${String(
                              patient.severity || "",
                            ).toLowerCase()}`}
                          >
                            {patient.severity || "—"}
                          </span>
                        </td>

                        <td>
                          <div className="patient-actions">
                            {/* VIEW PROFILE */}

                            <button
                              className="view-patient-btn"
                              onClick={() => openProfile(patient, index)}
                            >
                              View
                            </button>

                            {/* MARK VIEWED */}

                            <button
                              className="mark-viewed-btn"
                              onClick={() => markAsViewed(patient, index)}
                            >
                              ✓ Viewed
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* PREVIOUS PATIENTS */}

        <section className="previous-patients-section">
          <div className="previous-header">
            <div>
              <span className="previous-badge">History</span>

              <h2>Previously Viewed Patients</h2>

              <p>Patients manually marked as viewed.</p>
            </div>

            <div className="previous-count">{previousPatients.length}</div>
          </div>

          {filteredPreviousPatients.length === 0 ? (
            <div className="previous-empty">
              <div className="previous-empty-icon">📋</div>

              <p>No patients have been marked as viewed yet.</p>
            </div>
          ) : (
            <div className="previous-patient-list">
              {filteredPreviousPatients.map((patient) => {
                const index = patients.indexOf(patient);

                const id = getPatientId(patient, index);

                return (
                  <div className="previous-patient-card" key={id}>
                    <div className="previous-patient-avatar">
                      {String(patient.name || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="previous-patient-info">
                      <h3>{patient.name || "Unknown Patient"}</h3>

                      <p>
                        {patient.main_problem ||
                          patient.mainProblem ||
                          "No problem specified"}
                      </p>
                    </div>

                    <span
                      className={`severity-badge ${String(
                        patient.severity || "",
                      ).toLowerCase()}`}
                    >
                      {patient.severity || "—"}
                    </span>

                    <button
                      className="previous-view-btn"
                      onClick={() => openProfile(patient, index)}
                    >
                      View Previous →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DoctorDashboard;
