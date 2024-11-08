class MemoryTracker {
    constructor() {
        this.startMemory = 0;
        this.peakMemory = 0;
        this.trackingInterval = null;
    }

    start() {
        this.startMemory = process.memoryUsage().heapUsed;
        this.peakMemory = this.startMemory;

        this.trackingInterval = setInterval(() => {
            const currentMemory = process.memoryUsage().heapUsed;
            this.peakMemory = Math.max(this.peakMemory, currentMemory);
        }, 1000);
    }

    stop() {
        clearInterval(this.trackingInterval);
        const endMemory = process.memoryUsage().heapUsed;

        return {
            startMemory: this.formatBytes(this.startMemory),
            peakMemory: this.formatBytes(this.peakMemory),
            endMemory: this.formatBytes(endMemory)
        };
    }

    formatBytes(bytes) {
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    }
}

module.exports = MemoryTracker;