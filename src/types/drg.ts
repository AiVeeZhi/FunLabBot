export interface DeepDiveStage {
	id: number;
	primary: string;
	secondary: string;
	warning?: string | null;
	anomaly?: string | null;
}
export interface DeepDiveVariant {
	type: string;
	name: string;
	biome: string;
	stages: DeepDiveStage[];
}
export interface DeepDiveResponse {
	startTime: string;
	endTime: string;
	variants: DeepDiveVariant[];
}
export interface DRGListResponse {
	salutes?: string[];
	trivia?: string[];
}