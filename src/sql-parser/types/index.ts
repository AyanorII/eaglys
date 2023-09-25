export type ColumnName = string;
export type HashedColumnName = string;

export interface HashedColumn {
	[key: ColumnName]: HashedColumnName;
}
