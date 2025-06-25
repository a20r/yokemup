export class InteractiveDiagram {
    private diagram: HTMLElement;
    private yokeMarker: HTMLElement;
    private line: HTMLElement;
    private leftBrakePost!: HTMLElement;
    private rightBrakePost!: HTMLElement;
    private leftBrakeArm!: HTMLElement;
    private rightBrakeArm!: HTMLElement;
    private leftStraddleCable!: HTMLElement;
    private rightStraddleCable!: HTMLElement;
    private leftCableAnchor!: HTMLElement;
    private rightCableAnchor!: HTMLElement;
    private mainBrakeCable!: HTMLElement;
    private seatPost!: HTMLElement;
    private cableHanger!: HTMLElement;
    private leftFrameStay!: HTMLElement;
    private rightFrameStay!: HTMLElement;
    private brakeSimulationActive = false;
    private readonly wheelCenterHeight = 110; // Center of semi-circular tire (bottom + half height)
    private readonly diagramHeight = 350;
    private readonly scale = 2.5; // pixels per mm
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
        // Create frame stays (seatstays) that connect to the main frame
        this.leftFrameStay = document.createElement('div');
        this.leftFrameStay.className = 'frame-stay frame-stay-left';
        this.leftFrameStay.id = 'leftFrameStay';

        this.rightFrameStay = document.createElement('div');
        this.rightFrameStay.className = 'frame-stay frame-stay-right';
        this.rightFrameStay.id = 'rightFrameStay';

        // Create seat post
        this.seatPost = document.createElement('div');
        this.seatPost.className = 'seat-post';
        this.seatPost.id = 'seatPost';

        // Create cable hanger on seat post (where main cable terminates)
        this.cableHanger = document.createElement('div');
        this.cableHanger.className = 'cable-hanger';
        this.cableHanger.id = 'cableHanger';

        // Create brake posts (mounting points on seatstays - these are the pivot points)
        this.leftBrakePost = document.createElement('div');
        this.leftBrakePost.className = 'brake-post brake-post-left';
        this.leftBrakePost.id = 'leftBrakePost';

        this.rightBrakePost = document.createElement('div');
        this.rightBrakePost.className = 'brake-post brake-post-right';
        this.rightBrakePost.id = 'rightBrakePost';

        // Create brake arms (cantilever arms that pivot on the posts)
        // Each arm has: brake shoe (contacts rim) and cable anchor (for straddle cable)
        this.leftBrakeArm = document.createElement('div');
        this.leftBrakeArm.className = 'brake-arm brake-arm-left';
        this.leftBrakeArm.id = 'leftBrakeArm';

        this.rightBrakeArm = document.createElement('div');
        this.rightBrakeArm.className = 'brake-arm brake-arm-right';
        this.rightBrakeArm.id = 'rightBrakeArm';

        // Create straddle cables (FROM yoke DOWN TO brake arm cable anchors)
        this.leftStraddleCable = document.createElement('div');
        this.leftStraddleCable.className = 'straddle-cable straddle-cable-left';
        this.leftStraddleCable.id = 'leftStraddleCable';

        this.rightStraddleCable = document.createElement('div');
        this.rightStraddleCable.className = 'straddle-cable straddle-cable-right';
        this.rightStraddleCable.id = 'rightStraddleCable';

        // Create cable anchor points (where straddle cables connect to brake arms)
        this.leftCableAnchor = document.createElement('div');
        this.leftCableAnchor.className = 'cable-anchor cable-anchor-left';
        this.leftCableAnchor.id = 'leftCableAnchor';

        this.rightCableAnchor = document.createElement('div');
        this.rightCableAnchor.className = 'cable-anchor cable-anchor-right';
        this.rightCableAnchor.id = 'rightCableAnchor';

        // Create main brake cable (from brake lever, through cable hanger, down to yoke)
        this.mainBrakeCable = document.createElement('div');
        this.mainBrakeCable.className = 'main-brake-cable';
        this.mainBrakeCable.id = 'mainBrakeCable';

        // Add all elements to diagram in proper z-order
        this.diagram.appendChild(this.leftFrameStay);
        this.diagram.appendChild(this.rightFrameStay);
        this.diagram.appendChild(this.seatPost);
        this.diagram.appendChild(this.cableHanger);
        this.diagram.appendChild(this.leftBrakePost);
        this.diagram.appendChild(this.rightBrakePost);
        this.diagram.appendChild(this.leftBrakeArm);
        this.diagram.appendChild(this.rightBrakeArm);
        this.diagram.appendChild(this.leftCableAnchor);
        this.diagram.appendChild(this.rightCableAnchor);
        this.diagram.appendChild(this.mainBrakeCable);
        this.diagram.appendChild(this.leftStraddleCable);
        this.diagram.appendChild(this.rightStraddleCable);
        this.diagram.appendChild(this.leftCableAnchor);
        this.diagram.appendChild(this.rightCableAnchor);
        this.diagram.appendChild(this.leftFrameStay);
        this.diagram.appendChild(this.rightFrameStay);
    }

    public setHeightChangeCallback(callback: (height: number) => void): void {
        this.onHeightChange = callback;
    }

    public updateDiagram(heightMm: number): void {
        const offset = heightMm * this.scale;
        const wheelCenterY = 120; // Center of the circular wheel
        const yokeBottom = wheelCenterY + offset;

        // Update yoke marker position
        this.yokeMarker.style.bottom = `${yokeBottom}px`;

        // Update measurement line (from wheel center to yoke)
        this.line.style.bottom = `${wheelCenterY}px`;
        this.line.style.height = `${offset}px`;

        // Position seat post at the back
        this.seatPost.style.bottom = `${wheelCenterY + 20}px`;
        this.seatPost.style.height = `${this.diagramHeight - wheelCenterY - 40}px`;

        // Position cable hanger on seat post
        const hangerHeight = wheelCenterY + 120;
        this.cableHanger.style.bottom = `${hangerHeight}px`;

        // Position brake posts around the wheel - positioned for rear cantilever view
        const brakePostHeight = wheelCenterY + 10; // At rim level, not tire level
        this.leftBrakePost.style.bottom = `${brakePostHeight}px`;
        this.rightBrakePost.style.bottom = `${brakePostHeight}px`;

        // Position brake arms (pivoting from posts)
        this.updateBrakeArms(brakePostHeight, yokeBottom);

        // Position main brake cable (from yoke UP to cable hanger)
        this.mainBrakeCable.style.bottom = `${yokeBottom}px`;
        this.mainBrakeCable.style.height = `${hangerHeight - yokeBottom}px`;

        // Calculate straddle cable positions (from yoke DOWN TO brake arm cable anchors)
        this.updateStraddleCables(yokeBottom, brakePostHeight);
    }

    private updateBrakeArms(brakePostHeight: number, yokeHeight: number): void {
        // Position brake arms level with each other at brake post height
        // Use reflection instead of rotation for proper rear view geometry

        this.leftBrakeArm.style.bottom = `${brakePostHeight - 3}px`;
        this.leftBrakeArm.style.transform = `translateX(-50%) scaleX(-1)`; // Reflect across Y-axis

        this.rightBrakeArm.style.bottom = `${brakePostHeight - 3}px`;
        this.rightBrakeArm.style.transform = `translateX(-50%)`; // Natural orientation
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

    private updateStraddleCables(yokeBottom: number, brakePostHeight: number): void {
        const yokeX = 50; // Center percentage (yoke position)
        const leftBrakeX = 30; // Left brake arm position 
        const rightBrakeX = 70; // Right brake arm position

        // For the left arm (reflected), the cable anchor is at the visual LEFT end
        // For the right arm (normal), the cable anchor is at the actual LEFT end
        const armLength = 55; // Distance from pivot to cable anchor at arm end

        const diagramWidth = this.diagram.offsetWidth;

        // Left brake arm cable anchor position (reflected arm)
        // Since it's reflected, the anchor point moves to the opposite visual side
        const leftAnchorX = leftBrakeX - (armLength / diagramWidth) * 100;
        const leftAnchorY = brakePostHeight;

        // Right brake arm cable anchor position (normal arm)
        // The anchor is at the left end of the arm (away from brake shoe)
        const rightAnchorX = rightBrakeX - (armLength / diagramWidth) * 100;
        const rightAnchorY = brakePostHeight;

        // Left straddle cable (FROM yoke DOWN TO left brake arm cable anchor)
        const leftDx = (leftAnchorX - yokeX) * diagramWidth / 100;
        const leftDy = leftAnchorY - yokeBottom;
        const leftLength = Math.sqrt(leftDx * leftDx + leftDy * leftDy);
        const leftAngle = Math.atan2(leftDy, leftDx) * 180 / Math.PI;

        this.leftStraddleCable.style.bottom = `${yokeBottom}px`;
        this.leftStraddleCable.style.left = `${yokeX}%`;
        this.leftStraddleCable.style.width = `${leftLength}px`;
        this.leftStraddleCable.style.transform = `rotate(${leftAngle}deg)`;
        this.leftStraddleCable.style.transformOrigin = '0 50%';

        // Right straddle cable (FROM yoke DOWN TO right brake arm cable anchor)
        const rightDx = (rightAnchorX - yokeX) * diagramWidth / 100;
        const rightDy = rightAnchorY - yokeBottom;
        const rightLength = Math.sqrt(rightDx * rightDx + rightDy * rightDy);
        const rightAngle = Math.atan2(rightDy, rightDx) * 180 / Math.PI;

        this.rightStraddleCable.style.bottom = `${yokeBottom}px`;
        this.rightStraddleCable.style.left = `${yokeX}%`;
        this.rightStraddleCable.style.width = `${rightLength}px`;
        this.rightStraddleCable.style.transform = `rotate(${rightAngle}deg)`;
        this.rightStraddleCable.style.transformOrigin = '0 50%';

        // Position cable anchor points visually
        this.updateCableAnchors(leftAnchorX, leftAnchorY, rightAnchorX, rightAnchorY);
    }

    private updateCableAnchors(leftAnchorX: number, leftAnchorY: number, rightAnchorX: number, rightAnchorY: number): void {
        // Position left cable anchor
        this.leftCableAnchor.style.left = `${leftAnchorX}%`;
        this.leftCableAnchor.style.bottom = `${leftAnchorY}px`;

        // Position right cable anchor
        this.rightCableAnchor.style.left = `${rightAnchorX}%`;
        this.rightCableAnchor.style.bottom = `${rightAnchorY}px`;
    }

    public simulateBrakePull(intensity: number = 0.5): void {
        // Simulate pulling the brake lever
        this.brakeSimulationActive = true;

        // Move yoke down slightly (cable tension)
        const currentYoke = parseFloat(this.yokeMarker.style.bottom || '0');
        const pullAmount = intensity * 8; // pixels
        this.yokeMarker.style.bottom = `${currentYoke - pullAmount}px`;

        // Make brake arms angle more inward
        const leftArm = this.leftBrakeArm;
        const rightArm = this.rightBrakeArm;
        leftArm.style.transform = leftArm.style.transform.replace(/rotate\([^)]+\)/, `rotate(${25 + intensity * 15}deg)`);
        rightArm.style.transform = rightArm.style.transform.replace(/rotate\([^)]+\)/, `rotate(-${25 + intensity * 15}deg)`);

        // Add tension effects to cables
        this.diagram.classList.add('brake-engaged');

        // Reset after animation
        setTimeout(() => {
            this.brakeSimulationActive = false;
            this.diagram.classList.remove('brake-engaged');
            // Reset positions would go here if needed
        }, 1000);
    }

    private getHeightFromPosition(yPos: number): number {
        const offset = yPos - this.wheelCenterHeight;
        return Math.max(offset / this.scale, 0);
    }

    private updateDiagramFromPosition(yokeY: number): void {
        // Update yoke marker position
        this.yokeMarker.style.bottom = `${yokeY}px`;

        // Update measurement line
        this.line.style.bottom = `${this.wheelCenterHeight}px`;
        this.line.style.height = `${yokeY - this.wheelCenterHeight}px`;

        // Position brake arms above the wheel
        const brakeArmHeight = this.wheelCenterHeight + 10; // Match the updated brakePostHeight

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
            y = Math.min(Math.max(y, this.wheelCenterHeight), this.diagramHeight);

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
            y = Math.min(Math.max(y, this.wheelCenterHeight), this.diagramHeight);

            const height = Math.round(this.getHeightFromPosition(y) * 10) / 10;
            this.updateDiagramFromPosition(y);
            this.onHeightChange?.(height);
        });
    }

    // Brake Simulation Methods
    public initBrakeControls(): void {
        const brakeLever = document.getElementById('brakeLever') as HTMLElement;
        const brakeStatus = document.getElementById('brakeStatus') as HTMLElement;

        if (brakeLever && brakeStatus) {
            brakeLever.addEventListener('click', () => {
                this.toggleBrakeSimulation();
                this.updateBrakeStatus(brakeStatus);
            });

            // Also respond to mouse hold for more realistic feel
            brakeLever.addEventListener('mousedown', () => {
                if (!this.brakeSimulationActive) {
                    this.engageBrake();
                    this.updateBrakeStatus(brakeStatus);
                }
            });

            brakeLever.addEventListener('mouseup', () => {
                if (this.brakeSimulationActive) {
                    this.releaseBrake();
                    this.updateBrakeStatus(brakeStatus);
                }
            });
        }
    }

    private toggleBrakeSimulation(): void {
        if (this.brakeSimulationActive) {
            this.releaseBrake();
        } else {
            this.engageBrake();
        }
    }

    private engageBrake(): void {
        this.brakeSimulationActive = true;
        this.diagram.classList.add('brake-engaged');

        // Animate brake arms closing - they should move closer to the rim
        // For reflected geometry, we need to adjust how the arms close
        this.leftBrakeArm.style.transform = 'translateX(-50%) scaleX(-1) rotate(-15deg)'; // Slight rotation + reflection
        this.rightBrakeArm.style.transform = 'translateX(-50%) rotate(15deg)'; // Slight rotation

        // Increase cable tension visual effects
        this.leftStraddleCable.style.height = '4px';
        this.rightStraddleCable.style.height = '4px';
        this.mainBrakeCable.style.width = '5px';
    }

    private releaseBrake(): void {
        this.brakeSimulationActive = false;
        this.diagram.classList.remove('brake-engaged');

        // Return brake arms to normal position
        this.leftBrakeArm.style.transform = 'translateX(-50%) scaleX(-1)'; // Reflection only
        this.rightBrakeArm.style.transform = 'translateX(-50%)'; // Natural orientation

        // Return cable tension to normal
        this.leftStraddleCable.style.height = '3px';
        this.rightStraddleCable.style.height = '3px';
        this.mainBrakeCable.style.width = '3px';
    }

    private updateBrakeStatus(statusElement: HTMLElement): void {
        const lever = document.getElementById('brakeLever') as HTMLElement;

        if (this.brakeSimulationActive) {
            statusElement.textContent = 'Brake Engaged';
            statusElement.classList.add('engaged');
            lever.classList.add('engaged');
        } else {
            statusElement.textContent = 'Brake Released';
            statusElement.classList.remove('engaged');
            lever.classList.remove('engaged');
        }
    }
}
