export interface NotionPageData {
    id: string;
    parentId: string;
    title: string;
    categories: string[];
    authorName: string;
    status: string;
    createdDate: Date;
    lastUpdateDate: Date;
}
