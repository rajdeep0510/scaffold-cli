import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rhhvlbptsyvhejnpbvxh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaHZsYnB0c3l2aGVqbnBidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODU0MzQsImV4cCI6MjA4NTQ2MTQzNH0.zO04aAkZTCs6kj8wgPZf1TyPOJAqF1qsw8qlcdpPiwo'
const STORAGE_BUCKET = 'published-components'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function listFolder() {
    console.log('Listing contents of "GradientBackground/" folder...')
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list('GradientBackground')

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Files in folder:')
    data.forEach(file => {
        console.log(`- Name: ${file.name}, ID: ${file.id}`)
    })
}

listFolder()
