"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logAction } from "@/lib/audit";

export default function Questions() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const { data } = await supabase
      .from("product_questions")
      .select("*, products(title), profiles(name)")
      .order("created_at", { ascending: false });

    setQuestions(data || []);
    setLoading(false);
  }

  async function submitAnswer(id: number) {
    const answer = answers[id];
    if (!answer?.trim()) return;

    setSaving(id);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("product_questions")
      .update({
        answer,
        answered_by: user?.id,
        answered_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(null);

    if (error) {
      alert("ثبت پاسخ با خطا مواجه شد: " + error.message);
      return;
    }

    logAction("answer_question", "product_question", id);
    load();
  }

  return (
    <main className="home-page space-y-6">
      <h1 className="section-title">❓ سوالات محصولات</h1>

      {loading && <p>در حال بارگذاری...</p>}
      {!loading && questions.length === 0 && <p>سوالی ثبت نشده.</p>}

      {questions.map((q) => (
        <div key={q.id} className="glass-card">
          <p>محصول: {q.products?.title}</p>
          <p>پرسیده شده توسط: {q.profiles?.name || "کاربر"}</p>
          <p><strong>سوال:</strong> {q.question}</p>

          {q.answer ? (
            <p><strong>پاسخ ثبت‌شده:</strong> {q.answer}</p>
          ) : (
            <div>
              <textarea
                placeholder="پاسخ خود را بنویسید..."
                value={answers[q.id] || ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
              <button
                className="primary-btn"
                onClick={() => submitAnswer(q.id)}
                disabled={saving === q.id}
              >
                {saving === q.id ? "در حال ثبت..." : "ثبت پاسخ"}
              </button>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
