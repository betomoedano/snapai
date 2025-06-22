# Telemetry & Usage Tracking Plan

## Overview
Simple, anonymous telemetry to understand usage patterns and prepare for future monetization. Privacy-focused approach with opt-out capability.

## Data Collection Strategy

### What We Track (Anonymous)
```javascript
{
  "session_id": "uuid-v4",           // Random session identifier
  "command": "icon",                 // Command used
  "success": true,                   // Generation success/failure
  "timestamp": 1640995200000,        // Unix timestamp
  "version": "1.0.0",               // CLI version
  "execution_time": 3450,           // Time in milliseconds
  "error_type": null,               // Error category if failed
  "prompt_length": 45,              // Character count of prompt
  "output_format": "png",           // Generated file format
  "model_used": "dall-e-3"          // AI model used
}
```

### What We DON'T Track
- User API keys
- Actual prompt content
- File paths or names
- Personal information
- IP addresses (beyond basic geolocation)
- Machine identifiers

## Implementation

### Simple HTTP Endpoint
```javascript
// src/services/telemetry.ts
export class TelemetryService {
  private static ENDPOINT = 'https://api.iconiq-analytics.com/v1/track';
  
  static async track(data: TelemetryData): Promise<void> {
    // Only track if user hasn't opted out
    if (this.isOptedOut()) return;
    
    try {
      await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `iconiq-cli/${process.env.npm_package_version}`
        },
        body: JSON.stringify(data),
        timeout: 5000
      });
    } catch (error) {
      // Fail silently - never break user experience
    }
  }

  static isOptedOut(): boolean {
    // Check local config for opt-out preference
    return ConfigService.get('telemetry.enabled') === false;
  }
}
```

### Usage in Commands
```javascript
// src/commands/icon.ts
export default class IconCommand extends Command {
  async run(): Promise<void> {
    const startTime = Date.now();
    const sessionId = this.generateSessionId();
    
    try {
      // ... icon generation logic
      
      await TelemetryService.track({
        session_id: sessionId,
        command: 'icon',
        success: true,
        timestamp: Date.now(),
        version: this.config.version,
        execution_time: Date.now() - startTime,
        prompt_length: flags.prompt.length,
        output_format: 'png',
        model_used: 'dall-e-3'
      });
      
    } catch (error) {
      await TelemetryService.track({
        session_id: sessionId,
        command: 'icon',
        success: false,
        timestamp: Date.now(),
        version: this.config.version,
        execution_time: Date.now() - startTime,
        error_type: this.categorizeError(error),
        prompt_length: flags.prompt?.length || 0
      });
      
      throw error;
    }
  }
}
```

## Privacy Controls

### Opt-out Mechanism
```bash
# Disable telemetry
npx iconiq config --telemetry false

# Check telemetry status
npx iconiq config --show-telemetry
```

### First-run Notice
```
🚀 Welcome to Iconiq!

This tool collects anonymous usage data to help improve the experience.
No personal information, API keys, or prompt content is collected.

To disable: npx iconiq config --telemetry false
Learn more: https://iconiq.dev/privacy

Continue? (y/n)
```

## Data Analysis Goals

### Key Metrics to Track
1. **Adoption Metrics**
   - Daily/weekly active users
   - Version adoption rate
   - Geographic distribution

2. **Usage Patterns**
   - Most popular commands
   - Success vs failure rates
   - Average prompt length
   - Peak usage times

3. **Performance Metrics**
   - Average execution time
   - Error rate by error type
   - API response times

4. **Feature Usage**
   - Command frequency
   - Flag usage patterns
   - Output format preferences

### Future Monetization Insights
- Heavy users (candidates for paid plans)
- Feature gaps (premium opportunities)
- Geographic markets for expansion
- Integration points with other tools

## Technical Implementation

### Simple Analytics Backend
```javascript
// Simple Node.js/Express endpoint
app.post('/v1/track', (req, res) => {
  const data = req.body;
  
  // Basic validation
  if (!isValidTelemetryData(data)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  
  // Store in database (MongoDB/PostgreSQL)
  await analytics.insertEvent(data);
  
  res.status(200).json({ status: 'ok' });
});
```

### Database Schema
```sql
-- PostgreSQL example
CREATE TABLE telemetry_events (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  command VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL,
  timestamp BIGINT NOT NULL,
  version VARCHAR(20) NOT NULL,
  execution_time INTEGER,
  error_type VARCHAR(50),
  prompt_length INTEGER,
  output_format VARCHAR(10),
  model_used VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for common queries
CREATE INDEX idx_telemetry_timestamp ON telemetry_events(timestamp);
CREATE INDEX idx_telemetry_command ON telemetry_events(command);
CREATE INDEX idx_telemetry_success ON telemetry_events(success);
```

## Compliance & Ethics

### Privacy Principles
1. **Minimal Data**: Only collect what's necessary
2. **Anonymous**: No personally identifiable information
3. **Transparent**: Clear about what we collect
4. **Opt-out**: Easy to disable
5. **Secure**: Encrypted transmission and storage

### Legal Considerations
- GDPR compliance (EU users)
- CCPA compliance (California users)
- Data retention policies (delete after 2 years)
- User consent mechanisms

## Implementation Timeline

### Week 1: Basic Tracking
- [ ] Simple HTTP POST telemetry
- [ ] Core metrics collection
- [ ] Opt-out mechanism

### Week 2: Privacy Controls
- [ ] First-run consent
- [ ] Privacy documentation
- [ ] Local config management

### Week 3: Analytics Backend
- [ ] Simple data collection API
- [ ] Basic analytics dashboard
- [ ] Data validation and security

### Future: Advanced Analytics
- [ ] Real-time usage monitoring
- [ ] Cohort analysis
- [ ] Predictive modeling for monetization

This approach balances valuable insights with user privacy, providing the foundation for data-driven product decisions while maintaining trust.