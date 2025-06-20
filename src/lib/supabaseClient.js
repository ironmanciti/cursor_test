import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- [서버 시작 시] 디버깅 코드 시작 ---
console.log("--- [supabaseClient.js] 환경 변수 로드 확인 ---");
console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "OK" : "ERROR: Not Found");
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "OK" : "ERROR: Not Found");
console.log("-------------------------------------------------");
// --- 디버깅 코드 끝 ---

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 