import { supabase } from '../../../../lib/supabaseClient';

// 특정 API 키 수정 (PUT)
export async function PUT(request, { params }) {
  const { id } = params;
  const { name, value } = await request.json();

  if (!name || !value) {
    return new Response(JSON.stringify({ error: 'Name and value are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('api_keys')
    .update({ name, key_value: value })
    .eq('id', id)
    .select()
    .single();

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

// 특정 API 키 삭제 (DELETE)
export async function DELETE(request, { params }) {
  const { id } = params;

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(null, {
    status: 204, // No Content
  });
} 