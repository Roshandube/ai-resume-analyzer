import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch all resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get("/resume");

        console.log("Resumes:", response.data);

        setResumes(response.data.resumes || response.data);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Unable to load resumes.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Delete resume
  const handleDelete = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/resume/${resumeId}`);

      setResumes((currentResumes) =>
        currentResumes.filter((resume) => resume._id !== resumeId),
      );
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to delete resume.");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading resumes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Resumes</h1>

          <button
            onClick={() => navigate("/upload")}
            className="bg-gray-900 text-white px-5 py-3 rounded hover:bg-gray-700"
          >
            + Analyze Resume
          </button>
        </div>

        {error && <p className="text-red-500 mb-5">{error}</p>}

        {resumes.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <h2 className="text-xl font-semibold mb-3">No resumes yet</h2>

            <p className="text-gray-500 mb-5">
              Upload your first resume to get an AI analysis.
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="bg-gray-900 text-white px-6 py-3 rounded"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-2">
                  {resume.originalName || resume.filename || "Resume"}
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString()
                    : ""}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/analysis/${resume._id}`)}
                    className="bg-gray-900 text-white px-4 py-2 rounded"
                  >
                    View Analysis
                  </button>

                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
