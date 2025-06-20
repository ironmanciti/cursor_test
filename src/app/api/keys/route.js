import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  // --- 디버깅 코드 시작 ---
  console.log("--- [API /api/keys] 환경 변수 확인 ---");
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "로드 성공" : "로드 실패 또는 없음");
  console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "로드 성공" : "로드 실패 또는 없음");
  console.log("-----------------------------------------");
  // --- 디버깅 코드 끝 ---

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const { name, value, type } = await request.json();

  if (!name || !value) {
    return new Response(JSON.stringify({ error: 'Name and value are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('api_keys')
    .insert([{ name, key_value: value, key_type: type, usage: Math.floor(Math.random() * 100) }])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
} 