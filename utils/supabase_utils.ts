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
    .upsert(
      { 
        id: conversationId, 
        conversation_history: conversationHistory,
        updated_at: new Date().toISOString()
      }, 
      { onConflict: 'id' }
    );

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

    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('story-images')
      .getPublicUrl(fileName);

    console.log('Image successfully uploaded:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function getConversationByUserId(userId: string) {
  const { data, error } = await supabaseClient
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })  // Get most recent first
    .limit(1);  // Get only one conversation

  if (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  return data?.[0] || null;  // Return first conversation or null
}

export async function saveImageToDatabase(userId: string, imageUrl: string) {
  const { data, error } = await supabaseClient
    .from('images')
    .insert([
      { 
        user_id: userId,
        image_url: imageUrl
      }
    ]);

  if (error) {
    console.error('Error saving image to database:', error);
    return null;
  }
  return data;
}
