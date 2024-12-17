import { KlaviyoMetric } from '../models/KlaviyoMetric';
import { DynamicList } from './shared/DynamicList';

export class KlaviyoMetricsList extends DynamicList {
  constructor(container) {
    super(container, KlaviyoMetric, 'metric');
  }

  createRowHTML(index) {
    return `
      <div class="row mb-4 klaviyo-metric" data-index="${index}">
        <div class="col-md-6">
          <div class="">
            <label class="form-label" for="klavio_metric_name_${index}">Metric name</label>
            <input 
              type="text" 
              class="form-control metric-name" 
              id="klavio_metric_name_${index}" 
              placeholder="Metric name"
              value="${this.items[index]?.name || ''}"
            >
          </div>
        </div>
        <div class="col-md-2">
          <div class="">
            <label class="form-label" for="klavio_metric_id_${index}">Metric ID</label>
            <input 
              type="text" 
              class="form-control metric-id" 
              id="klavio_metric_id_${index}" 
              placeholder=""
              value="${this.items[index]?.id || ''}"
            >
          </div>
        </div>
        <div class="col-md-4">
          <div class="">
            <label class="form-label" for="klavio_metric_type_${index}">Metric type</label>
            <select 
              class="form-select metric-type" 
              id="klavio_metric_type_${index}" 
              aria-label="Default select example"
            >
              <option value="">Select type</option>
              <option value="count" ${this.items[index]?.type === 'count' ? 'selected' : ''}>Count</option>
              <option value="revenue" ${this.items[index]?.type === 'revenue' ? 'selected' : ''}>Revenue</option>
              <option value="conversion" ${this.items[index]?.type === 'conversion' ? 'selected' : ''}>Conversion</option>
            </select>
          </div>
        </div>
        ${index > 0 ? `
          <div class="col-12 mt-2">
            <button type="button" class="btn btn-danger btn-sm remove-item">
              Remove Metric
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  getAddButtonText() {
    return 'Add New Metric';
  }
}