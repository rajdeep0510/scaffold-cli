import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rhhvlbptsyvhejnpbvxh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaHZsYnB0c3l2aGVqbnBidnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODU0MzQsImV4cCI6MjA4NTQ2MTQzNH0.zO04aAkZTCs6kj8wgPZf1TyPOJAqF1qsw8qlcdpPiwo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function listBuckets() {
    console.log('Listing buckets...')
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('Error listing buckets:', error)
        return
    }

    console.log('Buckets found:')
    data.forEach(bucket => {
        console.log(`- ${bucket.name} (Public: ${bucket.public})`)
    })
}

listBuckets()
