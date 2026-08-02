import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a resume.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // STEP 1: Upload Resume

      const formData = new FormData();

      formData.append("resume", file);

      const uploadResponse = await api.post("/resume/upload", formData);

      console.log("Upload response:", uploadResponse.data);

      const resumeId =
        uploadResponse.data.resume?._id || uploadResponse.data._id;

      if (!resumeId) {
        throw new Error("Resume ID not found.");
      }

      // STEP 2: Analyze Resume

      const analysisResponse = await api.post(`/ai/analyze/${resumeId}`, {
        jobDescription,
      });

      console.log("Analysis response:", analysisResponse.data);

      // STEP 3: Open Analysis Page

      navigate(`/analysis/${resumeId}`, {
        state: {
          analysis: analysisResponse.data,
        },
      });
    } catch (err) {
      console.error("Resume error:", err);

      setError(
        err.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-12">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          AI Resume Analyzer
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Upload your resume for an ATS-readiness analysis. Add a job
          description for job-specific matching.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume */}

          <div>
            <label className="block font-medium mb-2">Select Resume</label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded p-3"
            />
          </div>

          {file && (
            <p className="text-sm text-gray-600">Selected: {file.name}</p>
          )}

          {/* Job Description */}

          <div>
            <label className="block font-medium mb-2">
              Job Description (Optional)
            </label>

            <textarea
              rows="8"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the company's job description here..."
              className="w-full border rounded p-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              Add a job description to receive a job-specific match score.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white p-3 rounded hover:bg-gray-700 disabled:bg-gray-400"
          >
            {loading ? "Analyzing Resume..." : "Upload & Analyze"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadResume;
