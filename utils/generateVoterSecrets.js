const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateVoterSecret(voterID, salt) {
    const hashedSecret = crypto.createHash('sha256')
        .update(voterID + salt)
        .digest('hex');
    
    return hashedSecret.split('')
        .map(hex => parseInt(hex, 16)
        .toString(2)
        .padStart(4, '0'))
        .join('')
        .split('')
        .map(Number)
        .slice(0, 256);
}

function generateNullifierSecret() {
    return crypto.randomBytes(6).toString('hex');
}

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'voter_secrets');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Generate 256 voter secrets
for (let i = 0; i < 256; i++) {
    const voterID = `voter${i.toString().padStart(3, '0')}`;
    const salt = crypto.randomBytes(16).toString('hex');
    
    const inputData = {
        electionId: "123456",
        candidateId: 2,
        voterSecret: generateVoterSecret(voterID, salt),
        nullifierSecret: generateNullifierSecret()
    };

    // Write each voter's secret to a separate JSON file
    const filename = path.join(outputDir, `input_voter${i.toString().padStart(3, '0')}.json`);
    fs.writeFileSync(filename, JSON.stringify(inputData, null, 2));
}

console.log('Generated 256 voter secret files in', outputDir);