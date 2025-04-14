
export interface BlockData {
    id: string;
    pageId: string;
    parentId: string;
    title: string;
    authorName: string;
    content: string;
    createdAt: Date;
    documentType?: string[];
    lastEdited?: Date;
}
