// Types for the application
export interface BikeData {
    frame: string;
    size: string;
    tireWidthIn: number;
    brake: string;
    yoke: string;
    frontHeightMm: number;
    rearHeightMm: number;
}

export interface HeightResult {
    front: number;
    rear: number;
}

export interface FormData {
    frame: string;
    size: string;
    tireWidth: number;
    brake: string;
    yoke: string;
}
