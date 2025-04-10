

export class  NotionPageUtils {


    static getPageId(page : any): string {
        return page.id;
    }
    static getPageTitle(page : any): string {
        return page.properties.Titre.title[0]?.plain_text;
    }
    static getPageCategories(page: any): string[] {
        return page.properties.Catégorie.multi_select.map((categorie: any) => categorie.name);
    }

    static getPageParentId(page: any): string{ 
        return page.properties.Parent.relation[0]?.id;
    }

    static getPageCretiondate(page: any): Date {
        return new Date(page.created_time)
    }

    static getPageLastUpdatedDate(page: any): Date {
        return new Date(page.last_edited_time)
    }
    static getPageStatus(page: any): string {
        return page.properties.Statut.multi_select[0].name;
    }

    static getPageAuthor(page: any): string {
        return page.properties.Auteur.created_by.name;
    }


    
}