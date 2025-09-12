"""
Zeeky Kernel Service - FastAPI backend for the Zeeky AI assistant system
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import uvicorn
import logging
from datetime import datetime
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Zeeky Kernel Service",
    description="Core backend service for the Zeeky AI assistant system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    uptime: float

class IntentRequest(BaseModel):
    text: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None

class IntentResponse(BaseModel):
    intent: str
    confidence: float
    entities: List[Dict[str, Any]]
    response: str
    plugin_id: Optional[str] = None

class PluginInfo(BaseModel):
    id: str
    name: str
    version: str
    description: str
    capabilities: List[str]
    status: str

class PluginRegistration(BaseModel):
    id: str
    name: str
    version: str
    description: str
    capabilities: List[str]
    endpoint: str

# In-memory storage (replace with proper database in production)
plugins_registry: Dict[str, PluginInfo] = {}
start_time = datetime.now()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    uptime = (datetime.now() - start_time).total_seconds()
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version="1.0.0",
        uptime=uptime
    )

@app.post("/intent", response_model=IntentResponse)
async def process_intent(request: IntentRequest, background_tasks: BackgroundTasks):
    """Process user intent and route to appropriate plugin"""
    try:
        logger.info(f"Processing intent: {request.text}")
        
        # Simple intent classification (replace with ML model)
        intent = classify_intent(request.text)
        entities = extract_entities(request.text)
        
        # Route to appropriate plugin
        plugin_id = route_to_plugin(intent, entities)
        
        # Generate response
        response = await generate_response(intent, entities, plugin_id)
        
        return IntentResponse(
            intent=intent,
            confidence=0.8,  # Placeholder
            entities=entities,
            response=response,
            plugin_id=plugin_id
        )
        
    except Exception as e:
        logger.error(f"Error processing intent: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/plugins", response_model=List[PluginInfo])
async def get_plugins():
    """Get list of registered plugins"""
    return list(plugins_registry.values())

@app.post("/plugins", response_model=PluginInfo)
async def register_plugin(plugin: PluginRegistration):
    """Register a new plugin"""
    try:
        plugin_info = PluginInfo(
            id=plugin.id,
            name=plugin.name,
            version=plugin.version,
            description=plugin.description,
            capabilities=plugin.capabilities,
            status="active"
        )
        
        plugins_registry[plugin.id] = plugin_info
        logger.info(f"Registered plugin: {plugin.id}")
        
        return plugin_info
        
    except Exception as e:
        logger.error(f"Error registering plugin: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register plugin")

def classify_intent(text: str) -> str:
    """Simple intent classification (replace with ML model)"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ["play", "music", "song", "album"]):
        return "music_control"
    elif any(word in text_lower for word in ["schedule", "meeting", "calendar", "appointment"]):
        return "calendar_management"
    elif any(word in text_lower for word in ["note", "remember", "write", "save"]):
        return "note_taking"
    elif any(word in text_lower for word in ["weather", "temperature", "forecast"]):
        return "weather_query"
    elif any(word in text_lower for word in ["news", "headlines", "update"]):
        return "news_query"
    else:
        return "general_query"

def extract_entities(text: str) -> List[Dict[str, Any]]:
    """Simple entity extraction (replace with NER model)"""
    entities = []
    words = text.split()
    
    # Simple entity extraction logic
    for i, word in enumerate(words):
        if word.lower() in ["music", "song", "album"]:
            entities.append({"type": "media_type", "value": word, "start": i, "end": i+1})
        elif word.lower() in ["meeting", "appointment"]:
            entities.append({"type": "event_type", "value": word, "start": i, "end": i+1})
    
    return entities

def route_to_plugin(intent: str, entities: List[Dict[str, Any]]) -> Optional[str]:
    """Route intent to appropriate plugin"""
    for plugin_id, plugin in plugins_registry.items():
        if intent in plugin.capabilities:
            return plugin_id
    return None

async def generate_response(intent: str, entities: List[Dict[str, Any]], plugin_id: Optional[str]) -> str:
    """Generate response for the intent"""
    if plugin_id:
        return f"Processing {intent} using plugin {plugin_id}"
    else:
        return f"I understand you want to {intent}. Let me help you with that."

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)