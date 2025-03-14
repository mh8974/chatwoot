const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a simple HTML file to display Chatwoot information
const chatwootHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatwoot</title>
  <link rel="icon" href="/favicon-32x32.png">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f0f2f5;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    header {
      background-color: #1f93ff;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .header-right {
      display: flex;
      align-items: center;
    }
    .user-menu {
      margin-left: 1rem;
      position: relative;
      cursor: pointer;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #fff;
      color: #1f93ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .main-container {
      display: flex;
      flex: 1;
    }
    .sidebar {
      width: 240px;
      background-color: #fff;
      border-right: 1px solid #e6e6e6;
      padding: 1rem 0;
    }
    .sidebar-item {
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      color: #3c4858;
      text-decoration: none;
      cursor: pointer;
    }
    .sidebar-item:hover, .sidebar-item.active {
      background-color: #f0f7ff;
      color: #1f93ff;
    }
    .sidebar-item-icon {
      margin-right: 0.75rem;
      width: 20px;
      text-align: center;
    }
    .content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }
    h1 {
      margin-top: 0;
      color: #1f2d3d;
    }
    h2 {
      color: #1f2d3d;
    }
    p {
      color: #3c4858;
      line-height: 1.6;
    }
    .status {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .status-active {
      background-color: #44ce4b;
    }
    .status-inactive {
      background-color: #ff5c5c;
    }
    .info-row {
      display: flex;
      margin-bottom: 0.5rem;
    }
    .info-label {
      font-weight: bold;
      width: 150px;
    }
    .button {
      display: inline-block;
      background-color: #1f93ff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      margin-right: 1rem;
      margin-top: 1rem;
      cursor: pointer;
    }
    .button:hover {
      background-color: #0084ff;
    }
    footer {
      text-align: center;
      padding: 1rem;
      background-color: #1f2d3d;
      color: white;
    }
    .tab-container {
      margin-bottom: 2rem;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #e6e6e6;
    }
    .tab {
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      border-bottom: 3px solid transparent;
    }
    .tab.active {
      border-bottom: 3px solid #1f93ff;
      color: #1f93ff;
      font-weight: 500;
    }
    .tab-content {
      display: none;
      padding-top: 1.5rem;
    }
    .tab-content.active {
      display: block;
    }
    .conversation-list {
      border: 1px solid #e6e6e6;
      border-radius: 8px;
      overflow: hidden;
    }
    .conversation {
      padding: 1rem;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .conversation:hover {
      background-color: #f9f9f9;
    }
    .conversation:last-child {
      border-bottom: none;
    }
    .conversation-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e6e6e6;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-weight: bold;
    }
    .conversation-content {
      flex: 1;
    }
    .conversation-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .conversation-message {
      color: #666;
      font-size: 0.875rem;
    }
    .conversation-time {
      font-size: 0.75rem;
      color: #999;
    }
    .chat-container {
      display: flex;
      height: 600px;
      border: 1px solid #e6e6e6;
      border-radius: 8px;
      overflow: hidden;
    }
    .chat-sidebar {
      width: 300px;
      border-right: 1px solid #e6e6e6;
      background-color: #fff;
      overflow-y: auto;
    }
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .chat-header {
      padding: 1rem;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
    }
    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background-color: #f9f9f9;
    }
    .message {
      margin-bottom: 1rem;
      max-width: 70%;
    }
    .message.incoming {
      margin-right: auto;
    }
    .message.outgoing {
      margin-left: auto;
    }
    .message-bubble {
      padding: 0.75rem 1rem;
      border-radius: 8px;
    }
    .message.incoming .message-bubble {
      background-color: #fff;
      border: 1px solid #e6e6e6;
    }
    .message.outgoing .message-bubble {
      background-color: #1f93ff;
      color: #fff;
    }
    .message-time {
      font-size: 0.75rem;
      color: #999;
      margin-top: 0.25rem;
      text-align: right;
    }
    .message.outgoing .message-time {
      color: #ccc;
    }
    .chat-input {
      padding: 1rem;
      border-top: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
    }
    .chat-input input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 1.5rem;
      text-align: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1f93ff;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #666;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .feature-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      padding: 1.5rem;
      transition: transform 0.2s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .feature-icon {
      font-size: 2rem;
      color: #1f93ff;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">Chatwoot</div>
    <div class="header-right">
      <div class="user-menu">
        <div class="avatar">A</div>
      </div>
    </div>
  </header>
  
  <div class="main-container">
    <div class="sidebar">
      <div class="sidebar-item active" onclick="showContent('dashboard')">
        <div class="sidebar-item-icon">📊</div>
        <div>Dashboard</div>
      </div>
      <div class="sidebar-item" onclick="showContent('conversations')">
        <div class="sidebar-item-icon">💬</div>
        <div>Conversations</div>
      </div>
      <div class="sidebar-item" onclick="showContent('contacts')">
        <div class="sidebar-item-icon">👥</div>
        <div>Contacts</div>
      </div>
      <div class="sidebar-item" onclick="showContent('settings')">
        <div class="sidebar-item-icon">⚙️</div>
        <div>Settings</div>
      </div>
      <div class="sidebar-item" onclick="showContent('deployment')">
        <div class="sidebar-item-icon">🚀</div>
        <div>Deployment Info</div>
      </div>
    </div>
    
    <div class="content">
      <!-- Dashboard Content -->
      <div id="dashboard-content" class="content-section">
        <h1>Dashboard</h1>
        
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-value">42</div>
            <div class="stat-label">Open Conversations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">128</div>
            <div class="stat-label">Resolved Today</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">5.2m</div>
            <div class="stat-label">Avg Response Time</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">98%</div>
            <div class="stat-label">Customer Satisfaction</div>
          </div>
        </div>
        
        <div class="card">
          <h2>Recent Activity</h2>
          <p>Your team has resolved 128 conversations today, which is 15% higher than yesterday.</p>
          <p>Average first response time has improved by 12% this week.</p>
          <div class="button">View Full Report</div>
        </div>
        
        <h2>Chatwoot Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Engage with your customers in real-time through a modern chat interface.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Omnichannel</h3>
            <p>Connect with your customers across multiple channels from one platform.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Automation</h3>
            <p>Create chatbots and automate responses to common customer queries.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Gain insights into customer conversations and agent performance.</p>
          </div>
        </div>
      </div>
      
      <!-- Conversations Content -->
      <div id="conversations-content" class="content-section" style="display:none;">
        <h1>Conversations</h1>
        
        <div class="tab-container">
          <div class="tabs">
            <div class="tab active" onclick="showTab('open')">Open (42)</div>
            <div class="tab" onclick="showTab('resolved')">Resolved (156)</div>
            <div class="tab" onclick="showTab('all')">All</div>
          </div>
          
          <div id="open-tab" class="tab-content active">
            <div class="chat-container">
              <div class="chat-sidebar">
                <div class="conversation" onclick="selectConversation('john')">
                  <div class="conversation-avatar">J</div>
                  <div class="conversation-content">
                    <div class="conversation-name">John Doe</div>
                    <div class="conversation-message">Hello, I need help with my order...</div>
                  </div>
                  <div class="conversation-time">5m</div>
                </div>
                <div class="conversation">
                  <div class="conversation-avatar">S</div>
                  <div class="conversation-content">
                    <div class="conversation-name">Sarah Johnson</div>
                    <div class="conversation-message">Is the product available in blue?</div>
                  </div>
                  <div class="conversation-time">15m</div>
                </div>
                <div class="conversation">
                  <div class="conversation-avatar">M</div>
                  <div class="conversation-content">
                    <div class="conversation-name">Mike Wilson</div>
                    <div class="conversation-message">When will my order be shipped?</div>
                  </div>
                  <div class="conversation-time">32m</div>
                </div>
                <div class="conversation">
                  <div class="conversation-avatar">E</div>
                  <div class="conversation-content">
                    <div class="conversation-name">Emily Davis</div>
                    <div class="conversation-message">I'd like to return my purchase.</div>
                  </div>
                  <div class="conversation-time">1h</div>
                </div>
              </div>
              <div class="chat-main">
                <div class="chat-header">
                  <div class="conversation-avatar">J</div>
                  <div class="conversation-content">
                    <div class="conversation-name">John Doe</div>
                    <div class="conversation-message">Online • Last seen 5 minutes ago</div>
                  </div>
                </div>
                <div class="chat-messages">
                  <div class="message incoming">
                    <div class="message-bubble">
                      Hello, I need help with my order #12345. It's been a week and I haven't received any shipping confirmation.
                    </div>
                    <div class="message-time">10:32 AM</div>
                  </div>
                  <div class="message outgoing">
                    <div class="message-bubble">
                      Hi John, I'm sorry to hear that. Let me check the status of your order right away.
                    </div>
                    <div class="message-time">10:34 AM</div>
                  </div>
                  <div class="message outgoing">
                    <div class="message-bubble">
                      I can see that your order has been processed and is scheduled for shipping tomorrow. You should receive a shipping confirmation email within 24 hours.
                    </div>
                    <div class="message-time">10:36 AM</div>
                  </div>
                  <div class="message incoming">
                    <div class="message-bubble">
                      Thank you for checking. Can you also tell me which shipping carrier will be used?
                    </div>
                    <div class="message-time">10:38 AM</div>
                  </div>
                </div>
                <div class="chat-input">
                  <input type="text" placeholder="Type your message here...">
                  <div class="button">Send</div>
                </div>
              </div>
            </div>
          </div>
          
          <div id="resolved-tab" class="tab-content">
            <p>Showing 156 resolved conversations</p>
            <div class="conversation-list">
              <div class="conversation">
                <div class="conversation-avatar">R</div>
                <div class="conversation-content">
                  <div class="conversation-name">Robert Brown</div>
                  <div class="conversation-message">Thanks for your help!</div>
                </div>
                <div class="conversation-time">Yesterday</div>
              </div>
              <div class="conversation">
                <div class="conversation-avatar">L</div>
                <div class="conversation-content">
                  <div class="conversation-name">Lisa Wang</div>
                  <div class="conversation-message">Issue resolved, thank you.</div>
                </div>
                <div class="conversation-time">Yesterday</div>
              </div>
              <div class="conversation">
                <div class="conversation-avatar">D</div>
                <div class="conversation-content">
                  <div class="conversation-name">David Miller</div>
                  <div class="conversation-message">Perfect, that worked!</div>
                </div>
                <div class="conversation-time">2 days ago</div>
              </div>
            </div>
          </div>
          
          <div id="all-tab" class="tab-content">
            <p>Showing all conversations</p>
            <p>This tab would contain all conversations, both open and resolved.</p>
          </div>
        </div>
      </div>
      
      <!-- Contacts Content -->
      <div id="contacts-content" class="content-section" style="display:none;">
        <h1>Contacts</h1>
        <div class="card">
          <p>This section would display your customer contacts and allow you to manage them.</p>
          <p>Feature not fully implemented in this preview.</p>
        </div>
      </div>
      
      <!-- Settings Content -->
      <div id="settings-content" class="content-section" style="display:none;">
        <h1>Settings</h1>
        <div class="card">
          <p>This section would allow you to configure your Chatwoot instance.</p>
          <p>Feature not fully implemented in this preview.</p>
        </div>
      </div>
      
      <!-- Deployment Info Content -->
      <div id="deployment-content" class="content-section" style="display:none;">
        <h1>Deployment Information</h1>
        
        <div class="card">
          <div class="status">
            <div class="status-indicator status-active"></div>
            <span>Server Active</span>
          </div>
          
          <h2>Server Details</h2>
          <div class="info-row">
            <div class="info-label">Version:</div>
            <div>3.16.0</div>
          </div>
          <div class="info-row">
            <div class="info-label">Environment:</div>
            <div>Development</div>
          </div>
          <div class="info-row">
            <div class="info-label">Server Time:</div>
            <div>${new Date().toLocaleString()}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Node Version:</div>
            <div>${process.version}</div>
          </div>
        </div>
        
        <div class="card">
          <h2>Deployment Strategy</h2>
          <p>
            This simplified Express server approach avoids the Docker build issues on Railway by:
          </p>
          <ol>
            <li>Providing a lightweight Express server to serve Chatwoot assets</li>
            <li>Eliminating complex Docker builds that were failing during npm install</li>
            <li>Serving static files directly from the public directory</li>
            <li>Enabling a direct source code deployment without Docker</li>
          </ol>
          <p>
            For a full Chatwoot experience, the complete Rails application needs to be running.
            This Express server is intended as a lightweight solution for Railway deployment.
          </p>
        </div>
      </div>
    </div>
  </div>
  
  <footer>
    &copy; 2024 Chatwoot Inc. - Open Source Customer Engagement Suite
  </footer>
  
  <script>
    function showContent(contentId) {
      // Hide all content sections
      document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Show the selected content section
      document.getElementById(contentId + '-content').style.display = 'block';
      
      // Update active sidebar item
      document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
      });
      event.currentTarget.classList.add('active');
    }
    
    function showTab(tabId) {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the selected tab content
      document.getElementById(tabId + '-tab').classList.add('active');
      
      // Update active tab
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });
      event.currentTarget.classList.add('active');
    }
    
    function selectConversation(userId) {
      // This would normally load the conversation data
      console.log('Selected conversation with user: ' + userId);
    }
  </script>
</body>
</html>
`;

// Serve the Chatwoot HTML for the root route
app.get('/', (req, res) => {
  res.send(chatwootHtml);
});

// Handle all other routes to serve the Chatwoot HTML
// This ensures that client-side routing can work properly
app.get('*', (req, res) => {
  // Check if the requested path exists as a static file
  const filePath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  
  // Otherwise, serve the Chatwoot HTML
  res.send(chatwootHtml);
});

app.listen(port, () => {
  console.log(`Chatwoot server running at http://localhost:${port}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);
});
