const MINE_RATE = 0;
const DIFFICULTY = 5;

const SIGNALE_OPTIONS = {
    scope: 'seshat',
    secrets: [],
    stream: process.stdout,
    types: {
        block: {
            badge: '📦',
            color: 'magenta',
            label: 'block',
            logLevel: 'info'
        }
    }
};

module.exports = {
    MINE_RATE,
    DIFFICULTY,
    SIGNALE_OPTIONS
};