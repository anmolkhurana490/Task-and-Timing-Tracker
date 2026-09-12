import Link from "next/link";

export default function HomeView() {
  return (
    <div className="mx-auto max-w-310 px-5 py-12 sm:px-8 sm:py-20">
      <section className="grid min-h-0 items-center gap-12 py-9 md:min-h-140 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:gap-[8%] md:py-0">
        <div className="max-w-165">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">Work with intention</p>
          <h1 className="font-serif text-[54px] font-normal leading-[.98] tracking-[-.045em] sm:text-[68px] md:text-[88px]">Make time visible. Make progress feel lighter.</h1>
          <p className="my-7 max-w-108 text-[19px] leading-[1.55] text-[#6d7973]">Tempo brings tasks, focus sessions, and daily productivity into one calm place.</p>

          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex rounded-full bg-[#476257] px-5 py-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" href="/auth/signup">Create your workspace</Link>
            <Link className="inline-flex rounded-full border border-[#d9ddd4] bg-transparent px-5 py-4 text-sm font-bold transition-transform hover:-translate-y-0.5" href="/auth/login">Sign in</Link>
          </div>
        </div>

        <div className="mx-2 rotate-2 bg-[#476257] p-7 text-white" aria-label="Today at a glance">
          <div className="flex justify-between text-xs uppercase tracking-[.08em] text-[#d7e1d4]">
            <span>Today</span>
            <span>
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#df7455]" /> On track
            </span>
          </div>

          <div className="mx-auto my-9 flex h-52 w-52 flex-col items-center justify-center rounded-full border border-[#a5b8a5] outline outline-offset-10 outline-[#718d79]">
            <strong className="font-serif text-[46px] font-normal tracking-tighter">04:18</strong>
            <span className="mt-1 text-xs uppercase text-[#c7d3c4]">focused</span>
          </div>

          <div className="border-t border-[#718d79] pt-3">
            <div className="flex items-center gap-2.5 py-2.5 text-[13px]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#df7455] bg-[#df7455] text-[10px] text-[#d7e1d4]">✓</span>
              <span>Plan the week</span>
              <small className="ml-auto text-[#c7d3c4]">08:30</small>
            </div>

            <div className="flex items-center gap-2.5 py-2.5 text-[13px]"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a5b8a5] text-[10px] text-[#d7e1d4]">2</span><span>Ship dashboard polish</span><small className="ml-auto text-[#c7d3c4]">Next</small></div>

            <div className="flex items-center gap-2.5 py-2.5 text-[13px]"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#a5b8a5] text-[10px] text-[#d7e1d4]">3</span><span>Review tomorrow</span><small className="ml-auto text-[#c7d3c4]">Later</small></div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 border-t border-[#d9ddd4] pt-8 sm:grid-cols-3">
        <Link className="group border border-[#d9ddd4] bg-[#fffefa] p-5 transition-transform hover:-translate-y-1" href="/dashboard">
          <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">01</span>
          <h2 className="mt-8 font-serif text-2xl font-normal">See your rhythm</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6d7973]">
            Understand focus time, completion, and momentum at a glance.
          </p>
        </Link>

        <Link className="group border border-[#d9ddd4] bg-[#fffefa] p-5 transition-transform hover:-translate-y-1" href="/tasks">
          <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">02</span>
          <h2 className="mt-8 font-serif text-2xl font-normal">Shape the work</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6d7973]">
            Turn natural thoughts into tasks with a clear next step.
          </p>
        </Link>

        <Link className="group border border-[#d9ddd4] bg-[#fffefa] p-5 transition-transform hover:-translate-y-1" href="/time-logs">
          <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#df7455]">03</span>
          <h2 className="mt-8 font-serif text-2xl font-normal">Keep the record</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6d7973]">
            Review every session and learn where your working time goes.
          </p>
        </Link>
      </section>
    </div>
  );
}
