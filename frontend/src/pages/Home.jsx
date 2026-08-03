import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Home() {
  const { token } = useAuth();

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-[72vh] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full text-center lg:text-left">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
            AI-powered career growth
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Improve Your Resume
            <span className="mt-2 block text-indigo-600">With AI</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg lg:mx-0">
            Upload your resume and get instant ATS scoring, AI feedback, skill
            gaps, and role-specific recommendations to stand out in interviews.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <Link
              to={token ? "/upload" : "/register"}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-700"
            >
              Analyze My Resume
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            What You Get
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            title="ATS Score"
            description="See how well your resume performs with applicant tracking systems and recruiters."
          />

          <Feature
            title="AI Feedback"
            description="Get clear feedback on your strengths, weak areas, and writing quality."
          />

          <Feature
            title="Skill Suggestions"
            description="Discover the missing skills and keywords that can make your resume stronger."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-7">
      <h3 className="mb-3 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-6 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export default Home;
