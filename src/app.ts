import { YokeCalculator } from './calculator.js';
import { InteractiveDiagram } from './diagram.js';
import type { FormData as AppFormData } from './types.js';
import { FormValidator } from './validator.js';

class YokeApp {
    private calculator: YokeCalculator;
    private diagram!: InteractiveDiagram;
    private validator!: FormValidator;
    private form!: HTMLFormElement;
    private resultElement!: HTMLElement;
    private loadingElement!: HTMLElement;

    constructor() {
        this.calculator = new YokeCalculator();
        this.initializeElements();
        this.initializeEventListeners();
        this.setupDiagram();
        // Wait for data to load, then populate form
        this.initializeApp();
    }

    private async initializeApp(): Promise<void> {
        await this.calculator.waitForData();
        this.populateFormOptions();
    }

    private initializeElements(): void {
        this.form = document.getElementById('calculator-form') as HTMLFormElement;
        this.resultElement = document.getElementById('result') as HTMLElement;
        this.loadingElement = document.getElementById('loading') as HTMLElement;
        this.validator = new FormValidator(this.form);

        if (!this.form || !this.resultElement) {
            throw new Error('Required DOM elements not found');
        }
    }

    private setupDiagram(): void {
        const diagramEl = document.getElementById('diagram') as HTMLElement;
        const yokeMarkerEl = document.getElementById('yokeMarker') as HTMLElement;
        const lineEl = document.getElementById('line') as HTMLElement;

        if (diagramEl && yokeMarkerEl && lineEl) {
            this.diagram = new InteractiveDiagram(diagramEl, yokeMarkerEl, lineEl);
            this.diagram.setHeightChangeCallback((height: number) => {
                this.updateResultFromDiagram(height);
            });
            // Initialize brake simulation controls
            this.diagram.initBrakeControls();
        }
    }

    private initializeEventListeners(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Real-time validation
        this.form.addEventListener('input', () => {
            this.clearResults();
        });

        // Frame change handler for dynamic size population
        const frameSelect = this.form.querySelector('[name="frame"]') as HTMLSelectElement;
        frameSelect?.addEventListener('change', () => {
            this.populateSizes(frameSelect.value);
        });
    }

    private async populateFormOptions(): Promise<void> {
        try {
            // Populate frames
            const frameSelect = this.form.querySelector('[name="frame"]') as HTMLSelectElement;
            const frames = this.calculator.getAvailableFrames();
            frames.forEach(frame => {
                const option = document.createElement('option');
                option.value = frame;
                option.textContent = frame;
                frameSelect.appendChild(option);
            });

            // Populate brakes
            const brakeSelect = this.form.querySelector('[name="brake"]') as HTMLSelectElement;
            const brakes = this.calculator.getAvailableBrakes();
            brakes.forEach(brake => {
                const option = document.createElement('option');
                option.value = brake;
                option.textContent = brake;
                brakeSelect.appendChild(option);
            });

            // Populate yokes
            const yokeSelect = this.form.querySelector('[name="yoke"]') as HTMLSelectElement;
            const yokes = this.calculator.getAvailableYokes();
            yokes.forEach(yoke => {
                const option = document.createElement('option');
                option.value = yoke;
                option.textContent = yoke;
                yokeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error populating form options:', error);
        }
    }

    private populateSizes(frame: string): void {
        const sizeSelect = this.form.querySelector('[name="size"]') as HTMLSelectElement;

        // Clear existing options except the first one
        while (sizeSelect.children.length > 1) {
            sizeSelect.removeChild(sizeSelect.lastChild!);
        }

        if (frame) {
            const sizes = this.calculator.getAvailableSizes(frame);
            sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                sizeSelect.appendChild(option);
            });
        }
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();

        if (!this.validator.validate()) {
            return;
        }

        this.showLoading(true);

        // Simulate async operation for better UX
        setTimeout(() => {
            try {
                const formData = this.getFormData();
                const result = this.calculator.findHeight(formData);
                this.displayResult(result);

                if (this.diagram) {
                    this.diagram.updateDiagram(result.front);
                    this.diagram.setBrakeType(formData.brake);
                }
            } catch (error) {
                this.displayError('An error occurred during calculation. Please try again.');
                console.error('Calculation error:', error);
            } finally {
                this.showLoading(false);
            }
        }, 300);
    }

    private getFormData(): AppFormData {
        const formData = new FormData(this.form);
        return {
            frame: formData.get('frame') as string,
            size: formData.get('size') as string,
            tireWidth: parseFloat(formData.get('tireWidth') as string),
            brake: formData.get('brake') as string,
            yoke: formData.get('yoke') as string,
        };
    }

    private displayResult(result: { front: number; rear: number }): void {
        this.resultElement.innerHTML = `
      <div class="result-success">
        <div class="result-item">
          <strong>Front Yoke Height:</strong>
          <span class="result-value">${result.front} mm</span>
        </div>
        <div class="result-item">
          <strong>Rear Yoke Height:</strong>
          <span class="result-value">${result.rear} mm</span>
        </div>
      </div>
    `;
        this.resultElement.style.display = 'block';
    }

    private updateResultFromDiagram(height: number): void {
        this.resultElement.innerHTML = `
      <div class="result-interactive">
        <div class="result-item">
          <strong>Interactive Height:</strong>
          <span class="result-value">${height} mm</span>
        </div>
        <small>Drag the red marker to adjust height</small>
      </div>
    `;
        this.resultElement.style.display = 'block';
    }

    private displayError(message: string): void {
        this.resultElement.innerHTML = `
      <div class="result-error">
        <strong>Error:</strong> ${message}
      </div>
    `;
        this.resultElement.style.display = 'block';
    }

    private clearResults(): void {
        this.resultElement.style.display = 'none';
    }

    private showLoading(show: boolean): void {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'block' : 'none';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YokeApp();
});
