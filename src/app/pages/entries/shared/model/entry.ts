import { Category } from "../../../categories/shared/model/category.model";

export class Entry {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: string,
        public amount?: string,
        public date?: string,
        public paid?: boolean,
        public categoryId?: number,
        public category?: Category,
        public user_id?: string,
    ){}

    static types = {
        expense: 'Despesa',
        revenue: 'Receita'
    };

    get paidText(): string {
        return this.paid ? 'Pago' : 'Pendente';
    }

}