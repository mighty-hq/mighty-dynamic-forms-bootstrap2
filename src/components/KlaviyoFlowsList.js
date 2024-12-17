import { KlaviyoFlow } from '../models/KlaviyoFlow';
import { DynamicList } from './shared/DynamicList';

export class KlaviyoFlowsList extends DynamicList {
  constructor(container) {
    super(container, KlaviyoFlow, 'flow');
  }

  createRowHTML(index) {
    return `
      <div class="row mb-4 klaviyo-flow" data-index="${index}">
        <div class="col-md-6">
          <div class="">
            <label class="form-label" for="klavio_flow_list_name_${index}">List name</label>
            <input 
              type="text" 
              class="form-control flow-name" 
              id="klavio_flow_list_name_${index}" 
              placeholder="List name"
              value="${this.items[index]?.name || ''}"
            >
          </div>
        </div>
        <div class="col-md-2">
          <div class="">
            <label class="form-label" for="klavio_flow_list_id_${index}">List ID</label>
            <input 
              type="text" 
              class="form-control flow-id" 
              id="klavio_flow_list_id_${index}" 
              placeholder=""
              value="${this.items[index]?.id || ''}"
            >
          </div>
        </div>
        <div class="col-md-4">
          <div class="">
            <label class="form-label" for="klavio_flow_list_type_${index}">List type</label>
            <select 
              class="form-select flow-type" 
              id="klavio_flow_list_type_${index}" 
              aria-label="Default select example"
            >
              <option value="">Select type</option>
              <option value="newsletter" ${this.items[index]?.type === 'newsletter' ? 'selected' : ''}>Newsletter</option>
              <option value="promotional" ${this.items[index]?.type === 'promotional' ? 'selected' : ''}>Promotional</option>
              <option value="transactional" ${this.items[index]?.type === 'transactional' ? 'selected' : ''}>Transactional</option>
            </select>
          </div>
        </div>
        ${index > 0 ? `
          <div class="col-12 mt-2">
            <button type="button" class="btn btn-danger btn-sm remove-item">
              Remove Flow
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  getAddButtonText() {
    return 'Add New Flow';
  }
}