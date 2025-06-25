export class FormValidator {
    private form: HTMLFormElement;
    private errors: Map<string, string> = new Map();

    constructor(form: HTMLFormElement) {
        this.form = form;
    }

    public validate(): boolean {
        this.errors.clear();
        const formData = new FormData(this.form);

        // Validate frame
        const frame = formData.get('frame') as string;
        if (!frame?.trim()) {
            this.errors.set('frame', 'Frame model is required');
        }

        // Validate size
        const size = formData.get('size') as string;
        if (!size?.trim()) {
            this.errors.set('size', 'Frame size is required');
        }

        // Validate tire width
        const tireWidth = formData.get('tireWidth') as string;
        const tireWidthNum = parseFloat(tireWidth);
        if (!tireWidth || isNaN(tireWidthNum) || tireWidthNum <= 0) {
            this.errors.set('tireWidth', 'Valid tire width is required');
        } else if (tireWidthNum > 5) {
            this.errors.set('tireWidth', 'Tire width seems too large (max 5 inches)');
        }

        // Validate brake
        const brake = formData.get('brake') as string;
        if (!brake?.trim()) {
            this.errors.set('brake', 'Brake type is required');
        }

        // Validate yoke
        const yoke = formData.get('yoke') as string;
        if (!yoke?.trim()) {
            this.errors.set('yoke', 'Yoke type is required');
        }

        this.displayErrors();
        return this.errors.size === 0;
    }

    private displayErrors(): void {
        // Clear previous errors
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
        this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Display new errors
        this.errors.forEach((message, fieldName) => {
            const field = this.form.querySelector(`[name="${fieldName}"]`) as HTMLElement;
            if (field) {
                field.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                field.parentNode?.insertBefore(errorDiv, field.nextSibling);
            }
        });
    }

    public getErrors(): Map<string, string> {
        return new Map(this.errors);
    }
}
