const root = document.getElementById('root');

async function getStatus() {
    const response = await fetch('/api/status');
    const data = await response.json();
    return data;
}

async function renderStatus() {
    const status = await getStatus();
    const statusDiv = document.createElement('div');
    statusDiv.innerHTML = `
        <h2>Status</h2>
        <p>Status: ${status.status}</p>
        <p>Uptime: ${status.uptime}</p>
    `;
    root.appendChild(statusDiv);
}

renderStatus();
