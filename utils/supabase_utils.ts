// import { createClient } from '@supabase/supabase-js';
const { createClient } = require('@supabase/supabase-js');

// ENVIRONMENT VARIABLES
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);


export async function fetchUserInfo(userId: string) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
  return data;
}

export async function saveConversation(conversationId: string, conversationHistory: string) {
  const { data, error } = await supabaseClient
    .from('conversations')
    .upsert({ conversation_id: conversationId, conversation_history: conversationHistory }, { onConflict: 'conversation_id' });

  if (error) {
    console.error('Error saving conversation history:', error);
    return null;
  }
  return data;
}

export async function createNewConversation(userId: string) {
  const { data, error } = await supabaseClient
    .from('conversations')
    .insert([{ user_id: userId }])
    .select('conversation_id')
    .single();

  if (error) {
    console.error('Error creating new conversation:', error);
    return null;
  }
  return data;
}

