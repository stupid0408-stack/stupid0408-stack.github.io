// Vercel 서버 함수: 방명록 저장/조회
// 경로: /api/guestbook
//
// 브라우저 → (이 함수) → Supabase 구조.
// 브라우저는 Supabase에 직접 접근하지 않고, 이 함수만 호출한다.
// Supabase 접근은 서버 전용 키(SUPABASE_SERVICE_ROLE_KEY)로 여기서만 수행한다.

import { createClient } from '@supabase/supabase-js';

// 환경 변수 (Vercel 프로젝트 설정에 입력)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 입력 제한
const NAME_MIN = 2, NAME_MAX = 12;
const MSG_MIN = 1, MSG_MAX = 100;

export default async function handler(req, res) {
  // 환경 변수 누락 시 안전하게 실패
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      error: '서버 설정이 완료되지 않았습니다. 환경 변수(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)를 확인하세요.',
      _hasUrl: !!SUPABASE_URL,
      _hasKey: !!SUPABASE_SERVICE_ROLE_KEY
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // ── 조회 ──────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('guestbook')
      .select('name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: '조회에 실패했습니다.', _debug: error.message, _hint: error.hint, _code: error.code });
    }
    return res.status(200).json({ entries: data });
  }

  // ── 저장 ──────────────────────────────
  if (req.method === 'POST') {
    // body 파싱 (Vercel이 JSON을 자동 파싱하지만, 문자열로 올 경우 대비)
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // 서버 측 검증
    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      return res.status(400).json({ error: `별명은 ${NAME_MIN}~${NAME_MAX}자여야 합니다.` });
    }
    if (message.length < MSG_MIN || message.length > MSG_MAX) {
      return res.status(400).json({ error: `메시지는 ${MSG_MIN}~${MSG_MAX}자여야 합니다.` });
    }

    const { data, error } = await supabase
      .from('guestbook')
      .insert({ name, message })
      .select('name, message, created_at')
      .single();

    if (error) {
      return res.status(500).json({ error: '저장에 실패했습니다.' });
    }
    return res.status(201).json({ entry: data });
  }

  // ── 그 외 메서드 ──────────────────────
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: '허용되지 않은 요청입니다.' });
}
