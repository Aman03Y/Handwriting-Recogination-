from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
import requests
from dotenv import load_dotenv
import os 
load_dotenv()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/ocr")
async def ocr(url: str, token: str):
    try:
        url = url.replace('files/', 'files%2F')
        url = f"{url}&token={token}"
        print(url)
        
        response = requests.get(url)
        response.raise_for_status()
        
        src = "https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/"
        files = {"srcImg": response.content}
        payload = {"Session": "string"}
        headers = {
             'X-RapidAPI-Key':os.getenv('api') ,
            'X-RapidAPI-Host':os.getenv('host') ,
        }
        
        response = requests.post(src, data=payload, files=files, headers=headers)
        response.raise_for_status()
        
        return response.json()['value'] if response.status_code == 200 else "Something went wrong"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching OCR result: {e}")
