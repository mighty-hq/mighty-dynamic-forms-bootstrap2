import { KlaviyoSection } from '../components/KlaviyoSection.js';
import { KlaviyoFlowsList } from '../components/KlaviyoFlowsList.js';
import { KlaviyoMetricsList } from '../components/KlaviyoMetricsList.js';
import { KlaviyoListsList } from '../components/KlaviyoListsList.js';
import { loadKlaviyoData } from '../utils/dataLoader.js';

export class KlaviyoForm {
  constructor(container) {
    this.container = container;
    this.init();
  }

  async init() {
    await this.loadData();
    this.render();
  }

  async loadData() {
    const data = await loadKlaviyoData();
    if (data) {
      this.formData = data.json_data;
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="bs-section-dragged">
        <div class="container py-7">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="mb-3">
                <h4 class="font-semibold mb-1">Klavio</h4>
                <p class="text-sm text-muted">
                  This data is required for analytics to work.
                </p>
              </div>
              <div class="mb-1">
                <div class="mb-3">
                  <label class="form-label" for="klavio_company_id">Klavio company ID</label>
                  <input
                    type="text"
                    class="form-control"
                    id="klavio_company_id"
                    placeholder="Klavio company id"
                    value="${this.formData?.klaviyo_company_id || ''}"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="klavio_token">Klavio Private Token</label>
                  <input
                    type="text"
                    class="form-control"
                    id="klavio_token"
                    placeholder="Klavio private token"
                    value="${this.formData?.klavio_private_token || ''}"
                  />
                </div>
                <hr class="mt-7 mb-7" />

                <div class="klaviyo-sections">
                  <div id="klaviyo-flows-section"></div>
                  <hr class="mt-7 mb-7" />

                  <div id="klaviyo-metrics-section"></div>
                  <hr class="mt-7 mb-7" />

                  <div id="klaviyo-lists-section"></div>
                  <hr class="mt-7 mb-7" />
                </div>
              </div>

              <div class="text-end">
                <button type="button" class="btn btn-neutral me-2">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initializeSections();
  }

  initializeSections() {
    // Initialize Klaviyo Flows section
    const flowsSection = new KlaviyoSection(
      this.container.querySelector('#klaviyo-flows-section'),
      'Klaviyo Flows',
      'flows'
    );
    const flowsList = new KlaviyoFlowsList(flowsSection.render());
    if (this.formData?.klaviyo_flows) {
      this.formData.klaviyo_flows.forEach(flow => {
        flowsList.addItem(flow);
      });
    }

    // Initialize Klaviyo Metrics section
    const metricsSection = new KlaviyoSection(
      this.container.querySelector('#klaviyo-metrics-section'),
      'Klaviyo Metrics',
      'metrics'
    );
    const metricsList = new KlaviyoMetricsList(metricsSection.render());
    if (this.formData?.klaviyo_metrics) {
      this.formData.klaviyo_metrics.forEach(metric => {
        metricsList.addItem(metric);
      });
    }

    // Initialize Klaviyo Lists section
    const listsSection = new KlaviyoSection(
      this.container.querySelector('#klaviyo-lists-section'),
      'Klaviyo Lists',
      'lists'
    );
    const listsList = new KlaviyoListsList(listsSection.render());
    if (this.formData?.klaviyo_lists) {
      this.formData.klaviyo_lists.forEach(list => {
        listsList.addItem({
          name: list.category,
          id: list.list_id,
          type: 'marketing' // Default type since it's not in the sample data
        });
      });
    }
  }
}