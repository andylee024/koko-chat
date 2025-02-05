// import { createClient } from '@supabase/supabase-js';
const { createClient } = require('@supabase/supabase-js');

// ENVIRONMENT VARIABLES
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export async function fetchUserById(userId: string) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
  return data;
}

export async function fetchUserByEmail(email: string) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
  return data;
}

export async function createNewConversation(userId: string) {
  const { data, error } = await supabaseClient
    .from('conversations')
    .insert([{ user_id: userId }])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating new conversation:', error);
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


export async function uploadImageToStorage(file: File, userId: string) {
  try {
    // Create unique filename
    const fileName = `${userId}-${Date.now()}-${file.name}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabaseClient
      .storage
      .from('story-images')
      .upload(fileName, file);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('story-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

