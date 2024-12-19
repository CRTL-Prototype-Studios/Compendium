export type User = {
	id: string;
	email: string;
	profile: Profile;
};

export type Profile = {
	id: string;
	created_at: Date;
	updated_at: Date;
	owner: User;
	username: string;
	galleries: Gallery[];
	avatar: File[];
};

export type Gallery = {
	id: string;
	name: string;
	owner: Profile;
	public: boolean;
	created_at: Date;
	updated_at: Date;
};

export type File = {
	id: string;
	created_at: Date;
	updated_at: Date;
	directory: boolean;
	url: string;
	path: string;
	pseudoDir: string;
	fileName: string;
};

export type Media = {
	id: string;
	created_at: Date;
	updated_at: Date;
	content: File[];
	desc: string;
	name: string;
};

export type Schema = {
	galleries: Gallery;
	profiles: Profile;
	media: Media;
	files: File;
};
