import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Home() {
  const { token } = useAuth();

  return (
    <div className="bg-gray-50">
      {/* HERO */}

      <section className="min-h-[75vh] flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Improve Your Resume
            <span className="block mt-2">With AI</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Upload your resume and get instant AI-powered feedback, ATS scoring,
            strengths, weaknesses, and skill recommendations.
          </p>

          <Link
            to={token ? "/upload" : "/register"}
            className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg hover:bg-gray-700"
          >
            Analyze My Resume
          </Link>
        </div>
      </section>

      {/* FEATURES */}

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-10">What You Get</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Feature
            title="ATS Score"
            description="See how well your resume performs for Applicant Tracking Systems."
          />

          <Feature
            title="AI Feedback"
            description="Discover your resume's strengths and areas that need improvement."
          />

          <Feature
            title="Skill Suggestions"
            description="Identify missing skills that could make your resume stronger."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-white p-7 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>

      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;
