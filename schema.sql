-- ============================================================
-- ورشة «أول خطوة في عالم التصميم» — قاعدة البيانات
-- انسخي هذا الملف كاملًا والصقيه في Supabase → SQL Editor → Run
-- ============================================================

create extension if not exists pgcrypto;

-- الجلسات: كل ورشة = جلسة. الجلسة النشطة وحدها يدخلها الحضور.
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  label       text not null default 'ورشة',
  is_active   boolean not null default true,
  is_test     boolean not null default false,
  state       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- المشاركون بأسماء مستعارة (بدون حسابات)
create table if not exists participants (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references sessions(id) on delete cascade,
  nickname    text not null,
  last_seen   timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index if not exists participants_session_idx on participants(session_id);

-- التصويتات (الثقة قبل/بعد، المخاوف، الأداة المناسبة)
create table if not exists poll_votes (
  id              bigserial primary key,
  session_id      uuid not null references sessions(id) on delete cascade,
  poll_key        text not null,
  participant_id  uuid not null references participants(id) on delete cascade,
  value           text not null,
  created_at      timestamptz not null default now(),
  unique (session_id, poll_key, participant_id)
);
create index if not exists poll_votes_idx on poll_votes(session_id, poll_key);

-- إجابات المسابقة (مرتبطة بالاسم المستعار)
create table if not exists quiz_answers (
  id              bigserial primary key,
  session_id      uuid not null references sessions(id) on delete cascade,
  question_idx    int  not null,
  participant_id  uuid not null references participants(id) on delete cascade,
  choice          int  not null,
  is_correct      boolean not null,
  points          int  not null default 0,
  ms              int  not null,
  created_at      timestamptz not null default now(),
  unique (session_id, question_idx, participant_id)
);
create index if not exists quiz_answers_idx on quiz_answers(session_id, question_idx);

-- استبيان الدورات: منفصل تمامًا عن المشاركين والمسابقة
create table if not exists survey_responses (
  id            bigserial primary key,
  session_id    uuid not null references sessions(id) on delete cascade,
  anon_token    text not null,
  q1 text, q2 text, q3 text, q4 text, q5 text,
  contact       text,
  consent       boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (session_id, anon_token)
);

-- ============================================================
-- الحماية: القراءة العامة مسموحة لحالة الجلسة فقط.
-- كل الكتابة تتم من خادم الموقع بمفتاح الخدمة (لا يصل للمتصفح).
-- ============================================================
alter table sessions          enable row level security;
alter table participants      enable row level security;
alter table poll_votes        enable row level security;
alter table quiz_answers      enable row level security;
alter table survey_responses  enable row level security;

drop policy if exists "public read sessions" on sessions;
create policy "public read sessions" on sessions for select using (true);
-- لا سياسات أخرى = لا قراءة ولا كتابة من المتصفح لبقية الجداول.

-- التحديث اللحظي لحالة الجلسة
do $$
begin
  alter publication supabase_realtime add table sessions;
exception when duplicate_object then null;
end $$;
