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
    
    console.log('Search query:', query)
    console.log('User ID:', userId)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, get all existing candidates for this user
    const { data: existingCandidates, error: fetchError } = await supabaseClient
      .from('candidates')
      .select('*')
      .eq('user_id', userId)

    if (fetchError) {
      console.error('Error fetching existing candidates:', fetchError)
    }

    // If no existing candidates, generate some mock candidates first
    if (!existingCandidates || existingCandidates.length === 0) {
      console.log('No existing candidates found, generating mock candidates...')
      const mockCandidates = await generateMockCandidates()
      
      const candidatesWithUserId = mockCandidates.map(candidate => ({
        ...candidate,
        user_id: userId
      }))

      const { data: insertedCandidates, error: insertError } = await supabaseClient
        .from('candidates')
        .insert(candidatesWithUserId)
        .select()

      if (insertError) {
        console.error('Error inserting mock candidates:', insertError)
        throw insertError
      }

      // Use the inserted candidates for matching
      const matchedCandidates = await matchCandidatesWithLLM(query, insertedCandidates)
      
      return new Response(
        JSON.stringify({ candidates: matchedCandidates }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Use LLM to match and rank existing candidates
    const matchedCandidates = await matchCandidatesWithLLM(query, existingCandidates)
    
    console.log('LLM matched candidates:', matchedCandidates.length)

    return new Response(
      JSON.stringify({ candidates: matchedCandidates }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in AI candidate search:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function matchCandidatesWithLLM(query: string, candidates: any[]) {
  const grokApiKey = Deno.env.get('GROK_API_KEY')
  
  if (!grokApiKey) {
    console.log('No Grok API key found, falling back to keyword matching')
    return performKeywordMatching(query, candidates)
  }

  try {
    console.log('Using Grok LLM for candidate matching...')
    console.log('API Key present:', !!grokApiKey)
    
    // Prepare candidate profiles for LLM
    const candidateProfiles = candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      title: candidate.title,
      company: candidate.company,
      location: candidate.location,
      experience_years: candidate.experience_years,
      skills: candidate.skills || [],
      education: candidate.education
    }))

    console.log('Candidate profiles prepared:', candidateProfiles.length)

    const prompt = `You are an expert recruiter AI. Your task is to match candidates to a job search query and provide relevance scores.

SEARCH QUERY: "${query}"

CANDIDATES:
${JSON.stringify(candidateProfiles, null, 2)}

Please analyze each candidate against the search query and return a JSON array with the following structure:
[
  {
    "id": "candidate_id",
    "score": 85,
    "reasoning": "Brief explanation of why this candidate matches"
  }
]

Scoring criteria:
- 90-100: Perfect match (skills, experience, and background align perfectly)
- 80-89: Strong match (most requirements met with minor gaps)
- 70-79: Good match (solid fit with some missing elements)
- 60-69: Moderate match (partial fit, would need training/development)
- Below 60: Poor match (significant gaps)

Only return candidates with scores 60 and above. Sort by score descending.
Return ONLY the JSON array, no other text.`

    const requestBody = {
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are a professional recruiter AI that matches candidates to job requirements. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }

    console.log('Making request to Grok API...')

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Grok API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Grok API error details:', errorText)
      throw new Error(`Grok API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Grok API response received')
    
    const llmResponse = data.choices[0].message.content
    console.log('Grok LLM Response:', llmResponse)

    let matchResults
    try {
      matchResults = JSON.parse(llmResponse)
    } catch (parseError) {
      console.error('Failed to parse Grok LLM response:', parseError)
      console.error('Raw response:', llmResponse)
      return performKeywordMatching(query, candidates)
    }

    // Map the LLM results back to full candidate objects
    const rankedCandidates = matchResults.map((result: any) => {
      const candidate = candidates.find(c => c.id === result.id)
      if (candidate) {
        return {
          ...candidate,
          score: result.score,
          llm_reasoning: result.reasoning
        }
      }
      return null
    }).filter(Boolean)

    console.log('Successfully matched candidates with Grok LLM:', rankedCandidates.length)
    return rankedCandidates

  } catch (error) {
    console.error('Grok LLM matching failed:', error)
    return performKeywordMatching(query, candidates)
  }
}

function performKeywordMatching(query: string, candidates: any[]) {
  console.log('Performing keyword-based matching as fallback')
  
  const queryLower = query.toLowerCase()
  const keywords = queryLower.split(' ').filter(word => word.length > 2)
  
  return candidates.map(candidate => {
    let score = 0
    const candidateText = `${candidate.title} ${candidate.company} ${(candidate.skills || []).join(' ')} ${candidate.education}`.toLowerCase()
    
    keywords.forEach(keyword => {
      if (candidateText.includes(keyword)) {
        score += 15
      }
    })
    
    // Boost score based on experience relevance
    if (candidate.experience_years) {
      const expMatch = query.match(/(\d+)\+?\s*years?/i)
      if (expMatch) {
        const requestedExp = parseInt(expMatch[1])
        const diff = Math.abs(candidate.experience_years - requestedExp)
        if (diff <= 2) score += 20
        else if (diff <= 5) score += 10
      }
    }
    
    return {
      ...candidate,
      score: Math.min(score, 95)
    }
  }).filter(candidate => candidate.score >= 30)
    .sort((a, b) => b.score - a.score)
}

async function generateMockCandidates() {
  console.log('Generating mock candidate database...')
  
  const mockCandidates = [
    {
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      title: 'Senior React Developer',
      company: 'Google',
      location: 'San Francisco, CA',
      experience_years: 6,
      education: 'BS Computer Science - Stanford University',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'GraphQL'],
      score: 0,
      status: 'new',
      notes: 'Mock candidate for testing'
    },
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      title: 'AI Engineer',
      company: 'OpenAI',
      location: 'Remote',
      experience_years: 4,
      education: 'PhD Computer Science - MIT',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP'],
      score: 0,
      status: 'new',
      notes: 'Mock candidate for testing'
    },
    {
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@email.com',
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      experience_years: 8,
      education: 'MS Software Engineering - University of Washington',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      score: 0,
      status: 'new',
      notes: 'Mock candidate for testing'
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      title: 'Product Manager',
      company: 'Meta',
      location: 'New York, NY',
      experience_years: 5,
      education: 'MBA - Harvard Business School',
      skills: ['Product Strategy', 'Analytics', 'User Research', 'Agile', 'SQL'],
      score: 0,
      status: 'new',
      notes: 'Mock candidate for testing'
    },
    {
      name: 'David Kim',
      email: 'david.kim@email.com',
      title: 'Full Stack Developer',
      company: 'Stripe',
      location: 'Austin, TX',
      experience_years: 7,
      education: 'BS Software Engineering - UC Berkeley',
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      score: 0,
      status: 'new',
      notes: 'Mock candidate for testing'
    },
    {
      name: 'Lisa Wang',
      email: 'lisa.wang@email.com',
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      experience_years: 3,
      education: 'MS Data Science - Carnegie Mellon',
      skills: ['Python', 'R', 'SQL', 'Pandas', 'Scikit-learn'],
      score: 0,
      status: 'new',
      notes: 'Mock candidate for testing'
    }
  ]

  return mockCandidates
}
