// Save this as test-groq.js in your project root
// Run with: node test-groq.js

const Groq = require("groq-sdk");
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GROQ_API_KEY;

async function testGroqAPI() {
  console.log("🔍 Testing Groq AI API...\n");
  
  if (!API_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY not found in environment variables!");
    console.log("Make sure you have .env.local file with your API key");
    console.log("Get your key at: https://console.groq.com/keys\n");
    return;
  }
  
  console.log("✅ API Key found (starts with:", API_KEY.substring(0, 8) + "...)\n");
  
  try {
    const groq = new Groq({ apiKey: API_KEY });
    
    console.log("📡 Sending test request to Groq API...\n");
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say hello in one sentence"
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 100,
    });
    
    const response = chatCompletion.choices[0]?.message?.content || "";
    
    console.log("✅ SUCCESS! Groq API is working!\n");
    console.log("Response:", response);
    console.log("\n🎉 Your API key is valid and working correctly!");
    console.log("⚡ Groq is super fast compared to other providers!");
    
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    
    if (error.message.includes("rate limit") || error.message.includes("quota")) {
      console.log("\n⚠️  RATE LIMIT ISSUE DETECTED!");
      console.log("You've hit Groq's rate limits.");
      console.log("\nGroq Free Tier Limits:");
      console.log("- 30 requests per minute");
      console.log("- 14,400 requests per day");
      console.log("\nSolutions:");
      console.log("1. Wait 1 minute and try again");
      console.log("2. Upgrade to paid plan for higher limits");
    } else if (error.message.includes("API key") || error.message.includes("authentication")) {
      console.log("\n⚠️  API KEY ISSUE DETECTED!");
      console.log("Your API key might be invalid or disabled.");
      console.log("\nSolutions:");
      console.log("1. Verify your API key at: https://console.groq.com/keys");
      console.log("2. Create a new API key");
      console.log("3. Make sure you copied the entire key (starts with gsk_)");
    } else {
      console.log("\n⚠️  UNKNOWN ERROR!");
      console.log("Please check the error details above.");
    }
  }
}

testGroqAPI();