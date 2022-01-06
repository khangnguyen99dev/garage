import Http from '../Http';

export default class ServiceCrud {
    static instance = ServiceCrud.instance || new ServiceCrud();

    api_crud = "../../api";

    getAll = (model, params) => {
        return Http.get(`${this.api_crud}/${model}?${params || ''}`);
    }

    show = (model, id) => {
        return Http.get(`${this.api_crud}/${model}/${id}`);
    }

    create = (model, data, option) => {
        return Http.post(`${this.api_crud}/${model}`, data, option || '');
    }

    edit = (model, id) => {
        return Http.get(`${this.api_crud}/${model}/${id}/edit`);
    }

    update = (model, id, data) => {
        return Http.put(`${this.api_crud}/${model}/${id}`, data);
    }

    updateForm = (model, id, data, option) => {
        return Http.post(`${this.api_crud}/${model}/${id}?_method=put`, data, option || '');
    }

    delete = (model, id) => {
        return Http.delete(`${this.api_crud}/${model}/${id}`);
    }


    createdatafile(api, data, files) {
        let form_data = this.jsonToFormData(data);
        Object.values(files).forEach(function (file, index) {
            form_data.append(`files[${index}]`, file);
        });
        return Http({
            method: "post",
            url: `${this.api_crud}/${api}`,
            data: form_data,
            headers: this.header_dataform,
        })
    }
    updatedatafile(api, id, data, files) {
        let form_data = this.jsonToFormData(data);
        Object.values(files).forEach(function (file, index) {
            form_data.append(`files[${index}]`, file);
        });
        return Http({
            method: "post",
            url: `${this.api_crud}/${api}/${id}?_method=put`,
            data: form_data,
            headers: this.header_dataform,
        })
    }
    buildFormData(formData, data, parentKey = '') {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
                this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
            });
        } else {
            const value = data == null ? '' : data;
            formData.append(parentKey, value);
        }
    }
    jsonToFormData(data) {
        let formData = new FormData();
        this.buildFormData(formData, data);
        return formData;
    }
}