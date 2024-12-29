import { supabase } from '@/integrations/supabase/client'

export async function processDocument(file: File) {
  try {
    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: formData,
    })

    if (error) throw error
    return data.elements
  } catch (error) {
    console.error('Error processing document:', error)
    throw error
  }
}