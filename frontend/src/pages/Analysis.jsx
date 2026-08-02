import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Analysis() {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(
    location.state?.analysis?.analysis?.analysis || null,
  );

  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState("");

  useEffect(() => {
    // If analysis was passed from UploadResume,
    // we don't need to fetch it again.
    if (result) {
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/ai/analysis/${id}`);

        console.log("Fetched analysis:", response.data);

        const analysisResult =
          response.data.analysis?.analysis || response.data.analysis;

        setResult(analysisResult);
      } catch (err) {
        console.error(err);

        setError(err.response?.data?.message || "Analysis not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, result]);

  // -------------------------
  // LOADING
  // -------------------------

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading analysis...</div>;
  }

  // -------------------------
  // ERROR
  // -------------------------

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-3">Analysis not found</h2>

        <p className="text-gray-500 mb-5">{error}</p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-900 text-white px-6 py-3 rounded"
        >
          Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Resume Analysis</h1>

        {/* =========================
            ATS READINESS SCORE
        ========================== */}

        <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-3">ATS Readiness Score</h2>

          <p className="text-5xl font-bold">
            {result.atsScore}

            <span className="text-xl text-gray-500">/100</span>
          </p>

          <p className="text-gray-500 mt-3">
            General resume quality and ATS readiness
          </p>
        </div>

        {/* =========================
            JOB MATCH SCORE
        ========================== */}

        {result.jobMatchScore !== null &&
          result.jobMatchScore !== undefined && (
            <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
              <h2 className="text-xl font-semibold mb-3">Job Match Score</h2>

              <p className="text-5xl font-bold">
                {result.jobMatchScore}

                <span className="text-xl text-gray-500">/100</span>
              </p>

              <p className="text-gray-500 mt-3">
                Based on the provided job description
              </p>
            </div>
          )}

        {/* =========================
            SUMMARY
        ========================== */}

        <Section title="Resume Summary">
          <p className="text-gray-700 leading-7">{result.summary}</p>
        </Section>

        {/* =========================
            STRENGTHS
        ========================== */}

        <Section title="Strengths">
          <ul className="space-y-2">
            {result.strengths?.map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>
        </Section>

        {/* =========================
            AREAS TO IMPROVE
        ========================== */}

        <Section title="Areas to Improve">
          <ul className="space-y-2">
            {result.weaknesses?.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </Section>

        {/* =========================
            MATCHED SKILLS
        ========================== */}

        {result.matchedSkills?.length > 0 && (
          <Section title="Matched Skills">
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 px-3 py-2 rounded-full text-sm"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* =========================
            MISSING SKILLS
        ========================== */}

        {result.missingSkills?.length > 0 && (
          <Section title="Missing Skills">
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-2 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* =========================
            SUGGESTIONS
        ========================== */}

        {result.suggestions?.length > 0 && (
          <Section title="Suggestions">
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* =========================
            RECOMMENDED ROLES
        ========================== */}

        {result.recommendedRoles?.length > 0 && (
          <Section title="Recommended Roles">
            <div className="flex flex-wrap gap-2">
              {result.recommendedRoles.map((role, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-2 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* =========================
            BUTTONS
        ========================== */}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-gray-900 px-6 py-3 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/upload")}
            className="bg-gray-900 text-white px-6 py-3 rounded"
          >
            Analyze Another
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable section component

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {children}
    </div>
  );
}

export default Analysis;
