// Import the required npm packages 
import fs  from "fs"; 
import lighthouse  from "lighthouse"; 
import * as chromeLauncher  from "chrome-launcher"; 
import express, { json } from 'express'
const app = express();

app.use(express.json());
app.use(express.urlencoded());

async function scan(url) { 
  const chrome = await chromeLauncher 
    .launch({ chromeFlags: ["--headless"] }) 
   
  const options = { 
    logLevel: "info", 
    output: "json", 
    onlyCategories: ["performance",  
      "accessibility", "best-practices", "seo"], 
    audits: [ 
      "first-meaningful-paint", 
      "first-cpu-idle", 
      "byte-efficiency/uses-optimized-images", 
    ], 
    strategy: 'desktop',
    port: chrome.port, 
  }; 
  

  
const runnerResult =  
        await lighthouse(url, options); 
 
  await chrome.kill(); 
  return runnerResult
};

app.get('/',(req,res) => {
    res.send('working...')
})

app.get('/scan',async (req,res) => {
    try {
        const {url} = req.query;

        const result = await scan(url);
        res.status(200).json(result);
    } catch (error) {
        res.status(501).json({
            message: error.message,
            success: false
        })
    }
    
})

app.listen(4000,() => {
    console.log('server running on 4000');
})