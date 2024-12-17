import { KlaviyoList } from '../models/KlaviyoList';
import { DynamicList } from './shared/DynamicList';

export class KlaviyoListsList extends DynamicList {
  constructor(container) {
    super(container, KlaviyoList, 'list');
  }

  createRowHTML(index) {
    return `
      <div class="row mb-4 klaviyo-list" data-index="${index}">
        <div class="col-md-6">
          <div class="">
            <label class="form-label" for="klavio_list_name_${index}">List name</label>
            <input 
              type="text" 
              class="form-control list-name" 
              id="klavio_list_name_${index}" 
              placeholder="List name"
              value="${this.items[index]?.name || ''}"
            >
          </div>
        </div>
        <div class="col-md-2">
          <div class="">
            <label class="form-label" for="klavio_list_id_${index}">List ID</label>
            <input 
              type="text" 
              class="form-control list-id" 
              id="klavio_list_id_${index}" 
              placeholder=""
              value="${this.items[index]?.id || ''}"
            >
          </div>
        </div>
        <div class="col-md-4">
          <div class="">
            <label class="form-label" for="klavio_list_type_${index}">List type</label>
            <select 
              class="form-select list-type" 
              id="klavio_list_type_${index}" 
              aria-label="Default select example"
            >
              <option value="">Select type</option>
              <option value="marketing" ${this.items[index]?.type === 'marketing' ? 'selected' : ''}>Marketing</option>
              <option value="subscribers" ${this.items[index]?.type === 'subscribers' ? 'selected' : ''}>Subscribers</option>
              <option value="customers" ${this.items[index]?.type === 'customers' ? 'selected' : ''}>Customers</option>
            </select>
          </div>
        </div>
        ${index > 0 ? `
          <div class="col-12 mt-2">
            <button type="button" class="btn btn-danger btn-sm remove-item">
              Remove List
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  getAddButtonText() {
    return 'Add New List';
  }
}