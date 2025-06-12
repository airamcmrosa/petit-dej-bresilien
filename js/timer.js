
export class Timer {
    /**
     * Creates a new Timer instance.
     * @param {number} duration - The total time in seconds for the countdown.
     * @param {function} onComplete - A callback function to execute when the timer reaches zero.
     */
    constructor(duration, onComplete) {
        this.duration = duration;
        this.onComplete = onComplete; // The function to call when time is up.

        this.remainingTime = duration;
        this.isRunning = false;
        this.lastTime = 0;
    }

    /**
     * Starts the countdown timer.
     */
    start() {
        this.isRunning = true;
        this.lastTime = performance.now(); // Use a high-precision timestamp.
        this.remainingTime = this.duration; // Reset to full duration on start.

    }

    /**
     * Stops or pauses the timer.
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Updates the timer. This should be called on every frame of the game loop.
     */
    update() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Time elapsed in seconds.
        this.lastTime = currentTime;

        this.remainingTime -= deltaTime;

        // Check if the timer has finished.
        if (this.remainingTime <= 0) {
            this.remainingTime = 0;
            this.stop();
            // Execute the callback function if it exists.
            if (this.onComplete) {

                this.onComplete('noMoreTime');
            }
        }
    }


    getFormattedTime() {
        // Ensure time doesn't go below zero for display.
        const time = Math.max(0, this.remainingTime);

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        // Pad the seconds with a leading zero if needed.
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${minutes}:${formattedSeconds}`;
    }
}