export class InteractiveDiagram {
    private diagram: HTMLElement;
    private yokeMarker: HTMLElement;
    private line: HTMLElement;
    private leftBrakeArm!: HTMLElement;
    private rightBrakeArm!: HTMLElement;
    private leftStraddleCable!: HTMLElement;
    private rightStraddleCable!: HTMLElement;
    private mainBrakeCable!: HTMLElement;
    private readonly tireHeight = 60;
    private readonly diagramHeight = 300;
    private readonly scale = 3; // pixels per mm
    private isDragging = false;
    private onHeightChange?: (height: number) => void;

    constructor(
        diagramElement: HTMLElement,
        yokeMarkerElement: HTMLElement,
        lineElement: HTMLElement
    ) {
        this.diagram = diagramElement;
        this.yokeMarker = yokeMarkerElement;
        this.line = lineElement;
        this.createBrakeComponents();
        this.initEventListeners();
    }

    private createBrakeComponents(): void {
        // Create brake arms
        this.leftBrakeArm = document.createElement('div');
        this.leftBrakeArm.className = 'brake-arm brake-arm-left';
        this.leftBrakeArm.id = 'leftBrakeArm';

        this.rightBrakeArm = document.createElement('div');
        this.rightBrakeArm.className = 'brake-arm brake-arm-right';
        this.rightBrakeArm.id = 'rightBrakeArm';

        // Create straddle cables
        this.leftStraddleCable = document.createElement('div');
        this.leftStraddleCable.className = 'straddle-cable straddle-cable-left';
        this.leftStraddleCable.id = 'leftStraddleCable';

        this.rightStraddleCable = document.createElement('div');
        this.rightStraddleCable.className = 'straddle-cable straddle-cable-right';
        this.rightStraddleCable.id = 'rightStraddleCable';

        // Create main brake cable
        this.mainBrakeCable = document.createElement('div');
        this.mainBrakeCable.className = 'main-brake-cable';
        this.mainBrakeCable.id = 'mainBrakeCable';

        // Add all elements to diagram
        this.diagram.appendChild(this.leftBrakeArm);
        this.diagram.appendChild(this.rightBrakeArm);
        this.diagram.appendChild(this.leftStraddleCable);
        this.diagram.appendChild(this.rightStraddleCable);
        this.diagram.appendChild(this.mainBrakeCable);
    }

    public setHeightChangeCallback(callback: (height: number) => void): void {
        this.onHeightChange = callback;
    }

    public updateDiagram(heightMm: number): void {
        const offset = heightMm * this.scale;
        const yokeBottom = this.tireHeight + offset;

        // Update yoke marker position
        this.yokeMarker.style.bottom = `${yokeBottom}px`;

        // Update measurement line
        this.line.style.bottom = `${this.tireHeight}px`;
        this.line.style.height = `${offset}px`;

        // Position brake arms on the tire/rim
        const brakeArmHeight = this.tireHeight + 30; // Above tire
        this.leftBrakeArm.style.bottom = `${brakeArmHeight}px`;
        this.rightBrakeArm.style.bottom = `${brakeArmHeight}px`;

        // Position main brake cable from yoke upward
        this.mainBrakeCable.style.bottom = `${yokeBottom}px`;
        this.mainBrakeCable.style.height = `${this.diagramHeight - yokeBottom - 20}px`;

        // Calculate straddle cable positions and angles
        this.updateStraddleCables(yokeBottom, brakeArmHeight);
    }

    public setBrakeType(brakeType: string): void {
        // Remove existing brake type classes
        this.leftBrakeArm.className = this.leftBrakeArm.className.replace(/brake-type-\\w+/g, '');
        this.rightBrakeArm.className = this.rightBrakeArm.className.replace(/brake-type-\\w+/g, '');

        // Add new brake type class
        const brakeClass = this.getBrakeTypeClass(brakeType);
        this.leftBrakeArm.classList.add(brakeClass);
        this.rightBrakeArm.classList.add(brakeClass);
    }

    private getBrakeTypeClass(brakeType: string): string {
        if (brakeType.toLowerCase().includes('paul')) return 'brake-type-paul';
        if (brakeType.toLowerCase().includes('shimano')) return 'brake-type-shimano';
        if (brakeType.toLowerCase().includes('tektro')) return 'brake-type-tektro';
        if (brakeType.toLowerCase().includes('avid')) return 'brake-type-avid';
        if (brakeType.toLowerCase().includes('dia-compe')) return 'brake-type-dia-compe';
        return 'brake-type-default';
    }

    private updateStraddleCables(yokeBottom: number, brakeArmHeight: number): void {
        const yokeX = 50; // Center percentage
        const leftBrakeX = 30; // Left brake arm position
        const rightBrakeX = 70; // Right brake arm position

        // Calculate distances and angles for straddle cables
        const yokeY = yokeBottom;
        const brakeY = brakeArmHeight;

        // Left straddle cable
        const leftDx = (yokeX - leftBrakeX) * this.diagram.offsetWidth / 100;
        const leftDy = yokeY - brakeY;
        const leftLength = Math.sqrt(leftDx * leftDx + leftDy * leftDy);
        const leftAngle = Math.atan2(leftDy, leftDx) * 180 / Math.PI;

        this.leftStraddleCable.style.bottom = `${brakeY}px`;
        this.leftStraddleCable.style.left = `${leftBrakeX}%`;
        this.leftStraddleCable.style.width = `${leftLength}px`;
        this.leftStraddleCable.style.transform = `rotate(${leftAngle}deg)`;
        this.leftStraddleCable.style.transformOrigin = '0 50%';

        // Right straddle cable
        const rightDx = (yokeX - rightBrakeX) * this.diagram.offsetWidth / 100;
        const rightDy = yokeY - brakeY;
        const rightLength = Math.sqrt(rightDx * rightDx + rightDy * rightDy);
        const rightAngle = Math.atan2(rightDy, rightDx) * 180 / Math.PI;

        this.rightStraddleCable.style.bottom = `${brakeY}px`;
        this.rightStraddleCable.style.left = `${rightBrakeX}%`;
        this.rightStraddleCable.style.width = `${rightLength}px`;
        this.rightStraddleCable.style.transform = `rotate(${rightAngle}deg)`;
        this.rightStraddleCable.style.transformOrigin = '0 50%';
    }

    private getHeightFromPosition(yPos: number): number {
        const offset = yPos - this.tireHeight;
        return Math.max(offset / this.scale, 0);
    }

    private updateDiagramFromPosition(yokeY: number): void {
        // Update yoke marker position
        this.yokeMarker.style.bottom = `${yokeY}px`;

        // Update measurement line
        this.line.style.bottom = `${this.tireHeight}px`;
        this.line.style.height = `${yokeY - this.tireHeight}px`;

        // Position brake arms on the tire/rim
        const brakeArmHeight = this.tireHeight + 30; // Above tire

        // Position main brake cable from yoke upward
        this.mainBrakeCable.style.bottom = `${yokeY}px`;
        this.mainBrakeCable.style.height = `${this.diagramHeight - yokeY - 20}px`;

        // Calculate straddle cable positions and angles
        this.updateStraddleCables(yokeY, brakeArmHeight);
    }

    private initEventListeners(): void {
        this.yokeMarker.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.diagram.style.cursor = 'grabbing';
            this.diagram.classList.add('dragging');
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.diagram.style.cursor = '';
            this.diagram.classList.remove('dragging');
        });

        this.diagram.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const rect = this.diagram.getBoundingClientRect();
            let y = rect.bottom - e.clientY;
            y = Math.min(Math.max(y, this.tireHeight), this.diagramHeight);

            const height = Math.round(this.getHeightFromPosition(y) * 10) / 10;
            this.updateDiagramFromPosition(y);
            this.onHeightChange?.(height);
        });

        // Touch events for mobile
        this.yokeMarker.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.diagram.classList.add('dragging');
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
            this.diagram.classList.remove('dragging');
        });

        this.diagram.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();

            const touch = e.touches[0];
            const rect = this.diagram.getBoundingClientRect();
            let y = rect.bottom - touch.clientY;
            y = Math.min(Math.max(y, this.tireHeight), this.diagramHeight);

            const height = Math.round(this.getHeightFromPosition(y) * 10) / 10;
            this.updateDiagramFromPosition(y);
            this.onHeightChange?.(height);
        });
    }
}
