const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Import agents
const DocSimplifierAgent = require('./agents/doc-simplifier');
const QAAgent = require('./agents/qa-agent');
const TranslationAgent = require('./agents/translation-agent');
const TTSAgent = require('./agents/tts-agent');

const app = express();
const PORT = process.env.MCP_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize agents
const docSimplifier = new DocSimplifierAgent();
const qaAgent = new QAAgent();
const translationAgent = new TranslationAgent();
const ttsAgent = new TTSAgent();

// Agent registry
const agents = {
  'doc-simplifier': docSimplifier,
  'qa-agent': qaAgent,
  'translation-agent': translationAgent,
  'tts-agent': ttsAgent
};

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    agents: Object.keys(agents).map(name => ({
      name,
      status: agents[name].getStatus()
    }))
  });
});

// Agent status endpoint
app.get('/agents/status', (req, res) => {
  const agentStatuses = Object.keys(agents).map(name => ({
    name: agents[name].getName(),
    status: agents[name].getStatus(),
    lastActivity: agents[name].getLastActivity()
  }));
  
  res.json(agentStatuses);
});

// Generic agent execution endpoint
app.post('/agents/:agentName/execute', async (req, res) => {
  try {
    const { agentName } = req.params;
    const agent = agents[agentName];
    
    if (!agent) {
      return res.status(404).json({ error: `Agent '${agentName}' not found` });
    }

    const result = await agent.execute(req.body);
    
    res.json({
      success: true,
      agent: agentName,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Agent execution error (${req.params.agentName}):`, error);
    res.status(500).json({
      success: false,
      agent: req.params.agentName,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Document simplification workflow
app.post('/workflows/simplify-document', async (req, res) => {
  try {
    const { documentText, language = 'en' } = req.body;
    
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required' });
    }

    console.log('Starting document simplification workflow...');
    
    // Step 1: Simplify document
    const simplificationResult = await docSimplifier.execute({
      text: documentText,
      language
    });

    // Step 2: If language is not English, translate the result
    let finalResult = simplificationResult;
    if (language !== 'en') {
      console.log(`Translating to ${language}...`);
      finalResult = await translationAgent.execute({
        text: JSON.stringify(simplificationResult.clauses),
        targetLanguage: language
      });
    }

    res.json({
      success: true,
      workflow: 'simplify-document',
      result: finalResult,
      steps: language !== 'en' ? ['simplify', 'translate'] : ['simplify'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Document simplification workflow error:', error);
    res.status(500).json({
      success: false,
      workflow: 'simplify-document',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Q&A workflow with translation and TTS
app.post('/workflows/qa-with-audio', async (req, res) => {
  try {
    const { question, documentText, language = 'en', includeAudio = false } = req.body;
    
    if (!question || !documentText) {
      return res.status(400).json({ error: 'Question and document text are required' });
    }

    console.log('Starting Q&A workflow...');
    
    // Step 1: Generate answer
    const qaResult = await qaAgent.execute({
      question,
      documentText,
      language: 'en' // Always generate in English first
    });

    let finalAnswer = qaResult.answer;
    
    // Step 2: Translate if needed
    if (language !== 'en') {
      console.log(`Translating answer to ${language}...`);
      const translationResult = await translationAgent.execute({
        text: qaResult.answer,
        targetLanguage: language
      });
      finalAnswer = translationResult.translatedText;
    }

    // Step 3: Generate TTS if requested
    let audioUrl = null;
    if (includeAudio) {
      console.log('Generating audio...');
      const ttsResult = await ttsAgent.execute({
        text: finalAnswer,
        language
      });
      audioUrl = ttsResult.audioUrl;
    }

    const steps = ['qa'];
    if (language !== 'en') steps.push('translate');
    if (includeAudio) steps.push('tts');

    res.json({
      success: true,
      workflow: 'qa-with-audio',
      result: {
        question,
        answer: finalAnswer,
        audioUrl,
        relevantClauses: qaResult.relevantClauses || []
      },
      steps,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Q&A workflow error:', error);
    res.status(500).json({
      success: false,
      workflow: 'qa-with-audio',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('MCP Server Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Available agents: ${Object.keys(agents).join(', ')}`);
  console.log('Health check: GET /health');
});

module.exports = app;
