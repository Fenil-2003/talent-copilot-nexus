
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, userId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate AI-powered mock candidates based on the search query
    const mockCandidates = await generateMockCandidates(query)
    
    // Save candidates to database
    const candidatesWithUserId = mockCandidates.map(candidate => ({
      ...candidate,
      user_id: userId
    }))

    const { data, error } = await supabaseClient
      .from('candidates')
      .insert(candidatesWithUserId)
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ candidates: data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function generateMockCandidates(query: string) {
  // AI-powered candidate generation based on search query
  const skillsMap: { [key: string]: string[] } = {
    'react': ['React', 'JavaScript', 'TypeScript', 'Node.js', 'HTML/CSS'],
    'python': ['Python', 'Django', 'Flask', 'PostgreSQL', 'AWS'],
    'devops': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    'ai': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science'],
    'product': ['Product Management', 'Analytics', 'Roadmapping', 'User Research', 'Agile']
  }

  const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote']
  const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Airbnb']
  
  // Extract relevant skills based on query
  let relevantSkills = ['JavaScript', 'Python', 'Communication', 'Problem Solving']
  for (const [key, skills] of Object.entries(skillsMap)) {
    if (query.toLowerCase().includes(key)) {
      relevantSkills = skills
      break
    }
  }

  const candidates = []
  for (let i = 0; i < 6; i++) {
    const firstName = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank'][i]
    const lastName = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller'][i]
    
    candidates.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      title: query.includes('senior') ? `Senior ${getJobTitle(query)}` : getJobTitle(query),
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      experience_years: Math.floor(Math.random() * 10) + 2,
      education: 'BS Computer Science',
      skills: relevantSkills.slice(0, 4),
      score: Math.floor(Math.random() * 30) + 70,
      status: 'new',
      notes: `Found through AI search for: ${query}`
    })
  }

  return candidates
}

function getJobTitle(query: string): string {
  if (query.toLowerCase().includes('react') || query.toLowerCase().includes('frontend')) {
    return 'Frontend Developer'
  }
  if (query.toLowerCase().includes('python') || query.toLowerCase().includes('backend')) {
    return 'Backend Developer'
  }
  if (query.toLowerCase().includes('devops')) {
    return 'DevOps Engineer'
  }
  if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('machine learning')) {
    return 'AI Engineer'
  }
  if (query.toLowerCase().includes('product')) {
    return 'Product Manager'
  }
  return 'Software Engineer'
}
