import { DirectionType } from '../enums';

export const LEFT_ROTATION = new Map<DirectionType, DirectionType>([
	[DirectionType.North, DirectionType.West],
	[DirectionType.East, DirectionType.North],
	[DirectionType.South, DirectionType.East],
	[DirectionType.West, DirectionType.South],
]);

export const RIGHT_ROTATION = new Map<DirectionType, DirectionType>([
	[DirectionType.North, DirectionType.East],
	[DirectionType.East, DirectionType.South],
	[DirectionType.South, DirectionType.West],
	[DirectionType.West, DirectionType.North],
]);
