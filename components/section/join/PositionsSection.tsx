import Link from "next/link";
import jobsData from "@/data/jobsData.json";

const PositionsSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
      <h2 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-[32px]">
        募集ポジション
      </h2>
      <div className="mt-9 flex flex-col gap-4">
        {jobsData.jobs.map((job) => (
          <Link
            key={job.title}
            href="#application"
            className="hover-lift flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-7 py-6 no-underline transition-colors hover:border-blue-600 hover:bg-blue-50/30 md:px-9 md:py-7"
          >
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900 md:text-xl">
                {job.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">
                {job.type}　・　{job.place}
              </p>
            </div>
            <span className="font-heading text-sm font-bold text-blue-600">応募する →</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PositionsSection;
