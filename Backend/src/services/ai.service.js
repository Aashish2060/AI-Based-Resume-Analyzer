const Groq = require("groq-sdk")
// const puppeteer = require("puppeteer")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert technical recruiter and career coach with 10+ years of experience conducting interviews at top tech companies.

Analyze the following candidate profile against the job description and generate a comprehensive, highly personalized interview preparation report.

=== CANDIDATE RESUME ===
${resume}

=== CANDIDATE SELF DESCRIPTION ===
${selfDescription}

=== JOB DESCRIPTION ===
${jobDescription}

=== INSTRUCTIONS ===
Generate a deeply personalized report based on the actual skills, experience, and gaps you identify. Do NOT give generic advice.

Return ONLY a valid JSON object with exactly these fields:

{
  "matchScore": a number between 0-100 reflecting how well the candidate matches the job requirements,

  "title": the exact job title from the job description,

  "technicalQuestions": an array of EXACTLY 7 objects. Each question must be directly based on the job requirements and candidate's resume. Format:
    {
      "question": a specific, realistic technical interview question,
      "intention": why the interviewer is asking this — what skill or knowledge they are testing,
      "answer": a detailed, structured answer covering key points, approach, examples, and what a strong candidate would say (minimum 4-5 sentences)
    },

  "behavioralQuestions": an array of EXACTLY 5 objects. Questions must be based on the job's soft skill requirements and candidate's background. Format:
    {
      "question": a realistic behavioral question using STAR format context,
      "intention": what trait or experience the interviewer is evaluating,
      "answer": a detailed sample answer using the STAR method (Situation, Task, Action, Result) tailored to the candidate's background (minimum 4-5 sentences)
    },

  "skillGaps": an array of objects identifying skills required by the job but weak or missing in the candidate's profile. Format:
    {
      "skill": the specific missing or weak skill,
      "severity": "low", "medium", or "high" based on how critical it is for the role
    },

  "preparationPlan": an array of EXACTLY 7 objects representing a day-by-day prep plan. Each day must be specific and actionable. Format:
    {
      "day": day number starting from 1,
      "focus": the main topic or theme for that day,
      "tasks": an array of at least 3 specific, actionable tasks the candidate should do that day (e.g. specific topics to study, problems to solve, videos to watch, mock interviews to do)
    }
}`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are an expert technical recruiter and career coach. You always return valid JSON only, with no extra text, markdown, or explanation outside the JSON object."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,      // balanced between creative and accurate
        max_tokens: 4096,
    })

    try {
        return JSON.parse(response.choices[0].message.content)
    } catch {
        return { raw: response.choices[0].message.content }
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    })
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `You are a professional resume writer with expertise in ATS optimization and modern resume design.

Using the candidate's existing resume and self-description, create a tailored, ATS-optimized resume in HTML format for the given job description.

=== CANDIDATE RESUME ===
${resume}

=== CANDIDATE SELF DESCRIPTION ===
${selfDescription}

=== TARGET JOB DESCRIPTION ===
${jobDescription}

=== REQUIREMENTS ===
- Tailor every section specifically to the job description using relevant keywords
- Use only real information from the candidate's resume — do NOT invent experience
- Write in a confident, human tone — must not sound AI-generated
- Professional, clean design with subtle colors (avoid flashy layouts)
- Fully ATS-compatible (no tables for layout, no images, clear section headings)
- Ideal length: 1 page (max 2 pages) when rendered as A4 PDF
- Sections to include: Summary, Skills, Experience, Projects, Education, (Certifications if any)
- Highlight skills and keywords that directly match the job description
- Use action verbs and quantify achievements where possible

Return ONLY a valid JSON object with exactly this field:
{
  "html": complete self-contained HTML string with inline CSS styles, ready to be rendered as a PDF
}`

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a professional resume writer. You always return valid JSON only, with no extra text or markdown outside the JSON object."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,   // lower = more precise and consistent output
        max_tokens: 4096,
    })

    let jsonContent
    try {
        jsonContent = JSON.parse(response.choices[0].message.content)
    } catch {
        throw new Error("Invalid JSON from Groq")
    }

    return generatePdfFromHtml(jsonContent.html)
}

module.exports = { generateInterviewReport, generateResumePdf }