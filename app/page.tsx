"use client";

import { useState } from "react";
import { getSpecialty } from "@/lib/specialties";

const AGES = ["Under 12", "12–17", "18–39", "40–64", "65+"];

const URGENCY_TIERS = [
  { key: "emergency", label: "Emergency" },
  { key: "urgent_today", label: "Today" },
  { key: "this_week", label: "This week" },
  { key: "routine", label: "Routine" },
];

function Footnotes() {
  return (
    <div className="footnotes no-print">
      <p>
        This is not a diagnosis. It helps you work out which kind of doctor to
        see, and what to bring when you go.
      </p>
      <p>
        Your symptoms are sent to Google&apos;s Gemini API to be read. This app
        does not store them.
      </p>
    </div>
  );
}

export default function Page() {
  const [screen, setScreen] = useState("landing");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);
  const [result, setResult] = useState<any>(null);
  const [chosen, setChosen] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [overrode, setOverrode] = useState(false);

  async function classify(withAnswers = answers) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, age, answers: withAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
      setScreen(withAnswers.length ? "results" : "followups");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setScreen("landing");
    setSymptoms("");
    setAge("");
    setAnswers([]);
    setResult(null);
    setChosen("");
    setOverrode(false);
  }

  // ---------------------------------------------------------------- landing
  if (screen === "landing") {
    return (
      <main className="wrap">
        <h1>CareMatch</h1>
        <p className="lede">
          Not sure which kind of doctor to see? Describe what&apos;s bothering
          you and find out where to start.
        </p>

        <p className="label">How it works</p>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div>
              <h3>Tell us what&apos;s going on</h3>
              <p>In your own words. No medical terms needed.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div>
              <h3>Answer a few questions</h3>
              <p>
                A short follow-up to narrow things down, the way a nurse would
                ask.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div>
              <h3>See who to visit, and how soon</h3>
              <p>
                Three suggested specialists, ranked, with what each one treats.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <div>
              <h3>Take a prep sheet with you</h3>
              <p>
                A printable page with your symptoms, questions to ask, and what
                to bring to the appointment.
              </p>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={() => setScreen("start")}>
            Find my specialist
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setScreen("about")}
          >
            How this was built
          </button>
        </div>

        <Footnotes />
      </main>
    );
  }

  // ------------------------------------------------------------------ about
  if (screen === "about") {
    return (
      <main className="wrap">
        <button className="back" onClick={() => setScreen("landing")}>
          ← Back
        </button>

        <h1>How this was built</h1>
        <p className="lede">
          CareMatch began as a classifier trained on clinical notes. It scored
          44.8%. Finding out why led to everything else.
        </p>

        <div className="section">
          <p className="label">The baseline</p>
          <p>
            TF-IDF + logistic regression and Naive Bayes were trained on the
            MTSamples dataset of roughly 5,000 medical transcriptions. Top-1
            accuracy reached 44.8% across 12 classes. That number sounds
            mediocre rather than broken — until you check what guessing would
            score. &ldquo;Surgery&rdquo; alone made up 29.7% of the test set, so
            a model that ignored its input entirely and always answered Surgery
            would score 29.7%. The trained model was fifteen points above that,
            with four classes at zero recall.
          </p>
        </div>

        <div className="section">
          <p className="label">What was actually wrong</p>
          <p>
            Two things. First, the label column mixed document types with
            specialties — &ldquo;SOAP / Chart / Progress Notes,&rdquo;
            &ldquo;Discharge Summary,&rdquo; and &ldquo;Consult - History and
            Phy.&rdquo; are formats, not doctors, and every note in the dataset
            is written in one of them. Those labels overlap with every real
            specialty, so no amount of training separates them.
          </p>
          <p style={{ marginTop: 14 }}>
            Second, the text was dictated clinical notes, while real users type
            things like &ldquo;my knee clicks when I go up stairs.&rdquo; A
            bag-of-words model has never seen that sentence.
          </p>
        </div>

        <div className="section">
          <p className="label">Ruling out the obvious fix</p>
          <p>
            The standard remedy for imbalanced classes is to reweight the loss
            function. Applying it made accuracy go <em>down</em>, from 44.8% to
            43.8%. Reweighting fixes a model that ignores small classes. It
            cannot fix classes that aren&apos;t mutually exclusive. That result
            is what showed the problem was upstream, in how the labels were
            defined, rather than in the training procedure.
          </p>
        </div>

        <div className="section">
          <p className="label">Rebuilding around the finding</p>
          <p>
            The 40 original labels were curated by hand down to 17
            patient-facing specialties, dropping document types along with
            Surgery and Radiology — neither is somewhere a patient books
            directly. The Gemini API then generated 3,406 symptom descriptions
            written the way patients write, balanced across all 17 specialties,
            and the classifier was retrained on those. This is knowledge
            distillation: using a large model to produce training data for a
            small one.
          </p>
        </div>

        <div className="section">
          <p className="label">Measuring it honestly</p>
          <p>
            Testing synthetic data against synthetic data only proves a model
            imitates its teacher. So a separate evaluation set was built from
            real transcripts, rewritten as patient descriptions but keeping the
            original human-assigned specialty as the answer key — a label no
            model in the pipeline produced. Twenty-nine cases were then filtered
            out where diagnoses, medication names, or test results leaked into
            the rewrite, since those would let a model read the answer rather
            than infer it.
          </p>
        </div>

        <div className="section">
          <p className="label">Results</p>
          <div className="results">
            <div className="results-row results-head">
              <div>Model</div>
              <div>Top-1</div>
              <div>Top-3</div>
            </div>
            <div className="results-row">
              <div>
                Original baseline
                <span className="results-note">12 contaminated classes</span>
              </div>
              <div>44.8%</div>
              <div>—</div>
            </div>
            <div className="results-row">
              <div>
                Distilled model
                <span className="results-note">synthetic holdout</span>
              </div>
              <div>48.9%</div>
              <div>75.5%</div>
            </div>
            <div className="results-row">
              <div>
                Distilled model
                <span className="results-note">transcript-derived eval</span>
              </div>
              <div>48.3%</div>
              <div>69.7%</div>
            </div>
            <div className="results-row results-best">
              <div>
                Gemini, zero-shot
                <span className="results-note">same eval set</span>
              </div>
              <div>66.6%</div>
              <div>88.3%</div>
            </div>
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            Chance is 5.9% across 17 classes. The distilled model went from 15
            points above a majority-class baseline to 42 points above random —
            but the language model still beat it by 18 points, which is why it
            does the classifying in the live app.
          </p>
        </div>

        <div className="section">
          <p className="label">Limitations</p>
          <ul className="tight">
            <li>
              The source dataset combines cardiology and pulmonology into one
              label, so those 17 evaluation cases count as correct if either is
              predicted. Excluding them entirely, top-1 drops to 45.8%.
            </li>
            <li>
              The evaluation set has 16–20 cases per specialty, so a single
              example moves a class by about five points. Per-class numbers are
              directional.
            </li>
            <li>
              Training data is synthetic. Specialties with few real source
              transcripts — dermatology and endocrinology especially — rest more
              on the language model&apos;s general knowledge than on the
              dataset.
            </li>
            <li>
              Hematology/Oncology scored 0% for the distilled model. Cancer
              symptoms in plain language are nonspecific — a lump, fatigue,
              weight loss — and patients don&apos;t self-route to oncology
              anyway. It stays in the label set but is a known weak point.
            </li>
            <li>
              Some descriptions genuinely can&apos;t be routed from one line.
              &ldquo;Can&apos;t catch my breath&rdquo; was generated as an
              emergency signal for both pulmonology and psychiatry. That finding
              is why the app asks follow-up questions instead of guessing.
            </li>
          </ul>
        </div>

        <div className="section">
          <p className="label">Built with</p>
          <p>
            Python, scikit-learn, and pandas for training and evaluation.
            Next.js, TypeScript, and CSS for the app, deployed on Vercel.
            Classification at runtime uses the Gemini API, called from a server
            route so the key never reaches the browser, with every response
            validated against the specialty list before it renders.
          </p>
        </div>

        <div className="btn-row" style={{ marginTop: 36 }}>
          <button className="btn" onClick={() => setScreen("start")}>
            Try it
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setScreen("landing")}
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ start
  if (screen === "start") {
    return (
      <main className="wrap">
        <button className="back" onClick={() => setScreen("landing")}>
          ← Back
        </button>

        <h1>What&apos;s going on?</h1>

        <p className="label" style={{ marginTop: 36 }}>
          Age
        </p>
        <div className="chips" style={{ marginBottom: 32 }}>
          {AGES.map((a) => (
            <button
              key={a}
              className="chip"
              aria-pressed={age === a}
              onClick={() => setAge(age === a ? "" : a)}
            >
              {a}
            </button>
          ))}
        </div>

        <p className="label">Symptoms</p>
        <textarea
          rows={6}
          value={symptoms}
          placeholder="My lower back has hurt for about a month and it's worse when I sit…"
          onChange={(e) => setSymptoms(e.target.value)}
        />

        {error && (
          <p style={{ color: "var(--alert)", marginTop: 16 }}>{error}</p>
        )}

        <div style={{ marginTop: 24 }}>
          <button
            className="btn"
            disabled={symptoms.trim().length < 3 || loading}
            onClick={() => classify([])}
          >
            {loading ? "Thinking…" : "Continue"}
          </button>
        </div>

        <Footnotes />
      </main>
    );
  }

  // -------------------------------------------------------------- followups
  if (screen === "followups") {
    const questions: string[] = result?.followups?.slice(0, 3) ?? [];

    return (
      <main className="wrap">
        <button className="back" onClick={() => setScreen("start")}>
          ← Back
        </button>

        <h1>A few more details</h1>
        <p className="lede">
          These sharpen the suggestion, and they go on your prep sheet.
        </p>

        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <p className="label">{q}</p>
            <input
              type="text"
              placeholder="Your answer"
              value={answers.find((a) => a.q === q)?.a || ""}
              onChange={(e) => {
                const next = answers.filter((a) => a.q !== q);
                if (e.target.value) next.push({ q, a: e.target.value });
                setAnswers(next);
              }}
            />
          </div>
        ))}

        {error && <p style={{ color: "var(--alert)" }}>{error}</p>}

        <div className="btn-row" style={{ marginTop: 32 }}>
          <button
            className="btn"
            disabled={loading}
            onClick={() => classify(answers)}
          >
            {loading ? "Thinking…" : "See suggestions"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => classify([{ q: "skipped", a: "no answer given" }])}
          >
            Skip
          </button>
        </div>

        <Footnotes />
      </main>
    );
  }

  // ------------------------------------------------------ emergency interrupt
  if (screen === "results" && result?.red_flag && !overrode) {
    return (
      <main className="wrap">
        <div className="emergency">
          <h2>Get emergency help now</h2>
          <p>
            <strong>Call 911, or go to your nearest emergency room.</strong>
          </p>
          <p style={{ marginBottom: 0 }}>{result.red_flag_reason}</p>
        </div>

        <p className="small muted" style={{ marginTop: 20 }}>
          If you&apos;re having thoughts of harming yourself, call or text 988 in
          the US to reach the Suicide &amp; Crisis Lifeline.
        </p>

        <div className="btn-row" style={{ marginTop: 28 }}>
          <button className="btn btn-secondary" onClick={restart}>
            Start over
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setOverrode(true)}
          >
            Show specialists anyway
          </button>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------- results
  if (screen === "results") {
    const ranked: string[] = [result.primary, ...(result.alternates || [])];

    return (
      <main className="wrap">
        <button className="back" onClick={restart}>
          ← Start over
        </button>

        <h1>Who to see</h1>
        <p className="lede">{result.reasoning}</p>

        <p className="label">How soon</p>
        <div className="scale">
          {URGENCY_TIERS.map((t) => (
            <div
              key={t.key}
              className="scale-step"
              data-active={result.urgency === t.key}
              data-emergency={t.key === "emergency"}
            >
              {t.label}
            </div>
          ))}
        </div>

        <p className="label">Suggested specialists</p>
        {ranked.map((name, i) => {
          const spec = getSpecialty(name);
          if (!spec) return null;
          return (
            <button
              key={name}
              className={`card ${i === 0 ? "card-best" : ""}`}
              onClick={() => {
                setChosen(name);
                setScreen("detail");
              }}
            >
              {i === 0 && <div className="badge">Best match</div>}
              <div className="card-name">{spec.plainName}</div>
              <div className="small muted">{spec.name}</div>
            </button>
          );
        })}

        <p className="small muted" style={{ marginTop: 18 }}>
          Confidence: {result.confidence}
          {result.confidence === "low" &&
            " — this could point in several directions. Starting with a primary care doctor is reasonable."}
        </p>

        <Footnotes />
      </main>
    );
  }

  // ----------------------------------------------------------------- detail
  if (screen === "detail") {
    const spec = getSpecialty(chosen);
    if (!spec) return null;

    return (
      <main className="wrap">
        <button className="back" onClick={() => setScreen("results")}>
          ← Back to suggestions
        </button>

        <p className="label">{spec.name}</p>
        <h1>{spec.plainName}</h1>

        <div className="section">
          <p className="label">What they treat</p>
          <p>{spec.treats}</p>
        </div>

        <div className="section">
          <p className="label">Why you were pointed here</p>
          <p>{result.reasoning}</p>
        </div>

        <div className="section">
          <p className="label">What a first visit involves</p>
          <p>{spec.firstVisit}</p>
        </div>

        <div className="btn-row" style={{ marginTop: 36 }}>
          <button className="btn" onClick={() => setScreen("sheet")}>
            View prep sheet
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const q = encodeURIComponent(`${spec.name} specialist near me`);
              navigator.geolocation.getCurrentPosition(
                (pos) =>
                  window.open(
                    `https://www.google.com/maps/search/${q}/@${pos.coords.latitude},${pos.coords.longitude},13z`,
                    "_blank"
                  ),
                () =>
                  window.open(
                    `https://www.google.com/maps/search/${q}`,
                    "_blank"
                  )
              );
            }}
          >
            Find one near me
          </button>
        </div>

        <div className="footnotes no-print">
          <p>
            Listings aren&apos;t vetted or endorsed. Call ahead to check they
            take your insurance and whether you need a referral first. If cost is
            a concern, community health centers charge on a sliding scale —
            findahealthcenter.hrsa.gov
          </p>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ sheet
  if (screen === "sheet") {
    const spec = getSpecialty(chosen);
    const prep = result.visit_prep || {};
    const given = answers.filter((a) => a.q !== "skipped");

    return (
      <main className="wrap">
        <button className="back no-print" onClick={() => setScreen("detail")}>
          ← Back
        </button>

        <div className="sheet">
          <div className="sheet-head">
            <h2>Visit prep sheet</h2>
            <p className="small muted" style={{ margin: 0 }}>
              {new Date().toLocaleDateString()} · Age {age || "not given"} ·
              Suggested: {spec?.plainName}
            </p>
          </div>

          <div className="sheet-section">
            <p className="label">What I&apos;m experiencing</p>
            <p>{prep.summary || symptoms}</p>
          </div>

          {given.length > 0 && (
            <div className="sheet-section">
              <p className="label">Details</p>
              {given.map((a, i) => (
                <div className="qa" key={i}>
                  <p className="qa-q">{a.q}</p>
                  <p className="qa-a">{a.a}</p>
                </div>
              ))}
            </div>
          )}

          <div className="sheet-section">
            <p className="label">Questions to ask</p>
            <ul className="tight">
              {(prep.questions_to_ask || []).map((q: string, i: number) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div className="sheet-section">
            <p className="label">Bring with me</p>
            <ul className="tight">
              {(spec?.bring || []).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
              {(prep.before_you_go || []).map((b: string, i: number) => (
                <li key={`p${i}`}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="sheet-foot">
            Generated by CareMatch — informational only, not a medical diagnosis.
          </div>
        </div>

        <div className="btn-row no-print" style={{ marginTop: 28 }}>
          <button className="btn" onClick={() => window.print()}>
            Download or print
          </button>
          <button className="btn btn-secondary" onClick={restart}>
            Start over
          </button>
        </div>
      </main>
    );
  }

  return null;
}