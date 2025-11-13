export enum WasteType {
  PLASTIC = 'Plastic',
  GLASS = 'Glass',
  METAL = 'Metal',
  ORGANIC = 'Organic',
  UNKNOWN = 'Unknown',
}

export interface WasteReport {
  id: string;
  imageUrl: string;
  wasteType: WasteType;
  timestamp: Date;
}