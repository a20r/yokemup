import type { BikeData, FormData, HeightResult } from './types.js';

export class YokeCalculator {
    private data: BikeData[] = [];
    private dataLoaded = false;

    constructor() {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        try {
            const response = await fetch('../data/heights.json');
            this.data = await response.json();
            this.dataLoaded = true;
            console.log(`Loaded ${this.data.length} bike configurations`);
        } catch (error) {
            console.warn('Could not load height data, using fallback calculation:', error);
            // Fallback data with some real examples
            this.data = [
                {
                    frame: 'Crust Romanceur',
                    size: '52cm',
                    tireWidthIn: 2.3,
                    brake: 'Paul Neo-Retro',
                    yoke: 'Rene Herse',
                    frontHeightMm: 28,
                    rearHeightMm: 28,
                },
                {
                    frame: 'Surly Cross-Check',
                    size: '54cm',
                    tireWidthIn: 2.1,
                    brake: 'Tektro CR720',
                    yoke: 'Tektro Triangle',
                    frontHeightMm: 30,
                    rearHeightMm: 30,
                },
            ];
            this.dataLoaded = true;
        }
    }

    public async waitForData(): Promise<void> {
        while (!this.dataLoaded) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    public findHeight(formData: FormData): HeightResult {
        const { frame, size, tireWidth, brake, yoke } = formData;

        for (const entry of this.data) {
            if (
                entry.frame.toLowerCase() === frame.toLowerCase() &&
                entry.size.toLowerCase() === size.toLowerCase() &&
                Math.abs(entry.tireWidthIn - tireWidth) < 0.01 &&
                entry.brake.toLowerCase() === brake.toLowerCase() &&
                entry.yoke.toLowerCase() === yoke.toLowerCase()
            ) {
                return { front: entry.frontHeightMm, rear: entry.rearHeightMm };
            }
        }

        // Fallback calculation
        const height = Math.round((12 + 7 * tireWidth) * 10) / 10;
        return { front: height, rear: height };
    }

    public getAvailableFrames(): string[] {
        return [...new Set(this.data.map(item => item.frame))];
    }

    public getAvailableSizes(frame: string): string[] {
        return [...new Set(
            this.data
                .filter(item => item.frame.toLowerCase() === frame.toLowerCase())
                .map(item => item.size)
        )];
    }

    public getAvailableBrakes(): string[] {
        return [...new Set(this.data.map(item => item.brake))];
    }

    public getAvailableYokes(): string[] {
        return [...new Set(this.data.map(item => item.yoke))];
    }
}
