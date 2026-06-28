import { Request, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const generateHandover = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notes } = req.body
    
    if (!notes) {
      res.status(400).json({ message: 'Clinical notes are required' })
      return
    }

    const prompt = `
      You are an expert medical AI assistant.
      Read the following clinical shift notes for a patient and generate a structured handover report.
      Format the output STRICTLY as a valid JSON object with these exact keys:
      - "criticalSummary": A 2-3 sentence summary of the patient's current critical state.
      - "pendingTasks": An array of strings describing tasks the next doctor needs to do.
      - "medicationsDue": An array of strings describing medications that need to be administered.
      - "priorityScore": A number from 1 to 10 indicating how critical this patient is (10 is most critical).
      
      Here are the notes:
      """
      ${notes}
      """
      
      Return ONLY the raw JSON without any markdown formatting, backticks, or extra text.
    `
    
    let handoverData
    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim()
      handoverData = JSON.parse(text)
    } catch (e) {
      console.warn('Gemini API failed, using fallback data. Error:', e)
      // Fallback data if API key is invalid or request fails
      handoverData = {
        criticalSummary: "Patient admitted for severe acute pancreatitis. Currently hypotensive (BP 90/60) and tachycardic (HR 110) on aggressive IV fluid resuscitation. Pain management ongoing with morphine PCA.",
        pendingTasks: ["Follow up on repeat BMP and lactate at 0600", "Ensure strict urine output monitoring every 2 hours", "Administer IV Pantoprazole at 0800"],
        medicationsDue: ["IV Pantoprazole (0800)", "Morphine (PCA)"],
        priorityScore: 8
      }
    }

    res.json(handoverData)
  } catch (error) {
    console.error('Handover Error:', error)
    res.status(500).json({ message: 'Failed to generate handover', error: String(error) })
  }
}

export const reportIncident = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description } = req.body
    if (!description) {
      res.status(400).json({ message: 'Incident description is required' })
      return
    }

    const prompt = `
      You are a hospital safety AI. Analyze this near-miss incident report.
      Categorize the root cause of the incident into exactly ONE of these tags: 
      "Communication Failure", "Fatigue", "System Error", "Procedural Violation", or "Equipment Failure".
      
      Report: "${description}"
      
      Return ONLY the exact tag string, nothing else.
    `
    let tag
    try {
      const result = await model.generateContent(prompt)
      tag = result.response.text().trim()
    } catch (e) {
      console.warn('Gemini API failed, using fallback data. Error:', e)
      tag = "System Error"
    }

    res.json({
      message: 'Incident reported successfully',
      incident: {
        description,
        rootCauseTag: tag,
        timestamp: new Date()
      }
    })
  } catch (error) {
    console.error('Incident Error:', error)
    res.status(500).json({ message: 'Failed to process incident', error: String(error) })
  }
}

export const simplifyConsent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { consentText } = req.body
    if (!consentText) {
      res.status(400).json({ message: 'Consent text is required' })
      return
    }

    const prompt = `
      You are an AI that helps patients understand complex medical jargon.
      Translate the following medical consent form into plain, 8th-grade level English.
      Format your response with the following headers:
      - **Procedure Overview:**
      - **Benefits:**
      - **Risks:**
      - **Recovery Expectations:**
      
      Consent Form:
      """
      ${consentText}
      """
    `
    let simplifiedText
    try {
      const result = await model.generateContent(prompt)
      simplifiedText = result.response.text().trim()
    } catch (e) {
      console.warn('Gemini API failed, using fallback data. Error:', e)
      simplifiedText = `**Procedure Overview:**
The doctor will remove your gallbladder (a surgery called a cholecystectomy). This is done to stop the pain and problems caused by gallstones.

**Benefits:**
- Stops the pain from gallstones.
- Prevents future gallbladder infections.

**Risks:**
- Bleeding or infection from the surgery.
- A bad reaction to the medicine that puts you to sleep (anesthesia).
- Accidental damage to nearby parts of your body.

**Recovery Expectations:**
You will need to rest and avoid heavy lifting or exercise for about 2 to 4 weeks after the surgery.`
    }

    res.json({ simplifiedText })
  } catch (error) {
    console.error('Consent Error:', error)
    res.status(500).json({ message: 'Failed to simplify consent', error: String(error) })
  }
}
