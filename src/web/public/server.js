// Simple web server to serve the Zeeky web interface
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname)));

// API endpoints for demo purposes
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        plugins: {
            active: 1247,
            total: 10000
        },
        features: {
            core: 1000,
            productivity: 2000,
            smartHome: 1500,
            healthcare: 1000,
            security: 800,
            creative: 1200,
            enterprise: 1500,
            media: 1000,
            industrial: 800,
            vehicle: 200
        },
        integrations: {
            homekit: 'connected',
            google: 'connected',
            microsoft: 'connected',
            carplay: 'disconnected'
        },
        metrics: {
            voiceCommands: Math.floor(Math.random() * 100) + 800,
            devices: Math.floor(Math.random() * 10) + 20,
            responseTime: Math.floor(Math.random() * 50) + 100
        }
    });
});

app.get('/api/plugins', (req, res) => {
    const plugins = [
        {
            id: 'productivity',
            name: 'Productivity Plugin',
            description: 'Task management and scheduling',
            category: 'productivity',
            features: 47,
            status: 'active'
        },
        {
            id: 'smart-home',
            name: 'Smart Home Plugin',
            description: 'Home automation and control',
            category: 'smart-home',
            features: 156,
            status: 'active'
        },
        {
            id: 'creative',
            name: 'Creative Plugin',
            description: 'Music and art generation',
            category: 'creative',
            features: 89,
            status: 'active'
        },
        {
            id: 'healthcare',
            name: 'Healthcare Plugin',
            description: 'Medical monitoring and EHR integration',
            category: 'healthcare',
            features: 234,
            status: 'inactive'
        },
        {
            id: 'security',
            name: 'Security Plugin',
            description: 'Personal and home security',
            category: 'security',
            features: 78,
            status: 'active'
        },
        {
            id: 'enterprise',
            name: 'Enterprise Plugin',
            description: 'Business and enterprise features',
            category: 'enterprise',
            features: 312,
            status: 'active'
        }
    ];
    
    res.json(plugins);
});

app.get('/api/activity', (req, res) => {
    const activities = [
        {
            id: 1,
            type: 'smart-home',
            description: 'Turned on living room lights',
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            source: 'voice'
        },
        {
            id: 2,
            type: 'productivity',
            description: 'Scheduled team meeting',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            source: 'voice'
        },
        {
            id: 3,
            type: 'creative',
            description: 'Generated ambient music',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            source: 'voice'
        },
        {
            id: 4,
            type: 'smart-home',
            description: 'Adjusted thermostat temperature',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: 'app'
        },
        {
            id: 5,
            type: 'security',
            description: 'Security system armed',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            source: 'automation'
        }
    ];
    
    res.json(activities);
});

// Handle voice commands (demo)
app.post('/api/voice-command', express.json(), (req, res) => {
    const { command } = req.body;
    
    // Simulate command processing
    setTimeout(() => {
        res.json({
            success: true,
            response: `Command "${command}" executed successfully`,
            actions: [
                {
                    type: 'notification',
                    message: 'Command completed'
                }
            ]
        });
    }, 1000);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Zeeky Web Interface running at http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔌 API Status: http://localhost:${PORT}/api/status`);
    console.log(`🎤 Voice Interface: Press Ctrl+K or click the Voice button`);
    console.log(`\n✨ Features:`);
    console.log(`   • Modern, responsive design`);
    console.log(`   • Interactive dashboard with real-time metrics`);
    console.log(`   • Plugin management interface`);
    console.log(`   • Voice command simulation`);
    console.log(`   • Integration status monitoring`);
    console.log(`   • Settings and configuration`);
});

module.exports = app;