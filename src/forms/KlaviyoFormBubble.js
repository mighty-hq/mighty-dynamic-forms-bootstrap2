export async function formbubble(container, form_data) {
  // Clear existing content while preserving the container

  function handleEvent(value, data) {
    console.log('handleEvent', value, data);
  }

  function formSubmitted(thisform) {
    console.log('formSubmitted', thisform);
    //console.log("dynamicForm submitted", dynamicForm);

    //const form = instance.data.formElement;
    //console.log("form", form);
    const klavio_company_id =
      thisform.container.elements.klavio_company_id.value;
    const klavio_token = thisform.container.elements.klavio_token.value;

    let klaviyoFlows = [];
    let klaviyoMetrics = [];
    let klaviyoLists = [];

    thisform.dynamicLists.forEach((list) => {
      if (list instanceof KlaviyoFlowsList) {
        klaviyoFlows = list.items.map((item) => item.toJSON());
      } else if (list instanceof KlaviyoMetricsList) {
        klaviyoMetrics = list.items.map((item) => item.toJSON());
      } else if (list instanceof KlaviyoListsList) {
        klaviyoLists = list.items.map((item) => item.toJSON());
      }
    });

    console.log('Klaviyo Flows List:', klaviyoFlows);
    console.log('Klaviyo Metrics List:', klaviyoMetrics);
    console.log('Klaviyo Lists List:', klaviyoLists);

    console.log(`klavio_company_id ${klavio_company_id} .`);
    console.log(`klavio_token ${klavio_token} .`);

    let updated_form_data = {
      klavio_company_id: klavio_company_id,
      klavio_token: klavio_token,
      klaviyo_flows: klaviyoFlows,
      klaviyo_metrics: klaviyoMetrics,
      klaviyo_lists: klaviyoLists,
    };

    console.log('UPDATED form_data', updated_form_data);

    // if (validItems.length === 0) {
    //   console.log(`Please add at least one complete ${this.itemType} before saving.`);
    // }

    // try {
    //   console.log(`Savingxxxxxxxxxxx ${this.itemType}s:`, validItems.map(item => item.toJSON()));
    // } catch (error) {
    //   console.error(`Error saving ${this.itemType}s:`, error);
    // }
    instance.triggerEvent('form_submitted');
  }

  function formCancelled() {
    console.log('formCancelledxxxxxxxxxxxxxx');
    //instance.triggerEvent('form_cancelled');
  }
  function setupListeners(list) {
    setupAddButton(list);
    //setupSaveButton(list);
  }

  function setupMightyListeners(form) {
    console.log(`setupMightyListeners .`, form);
    setupSubmitButton(form);
    setupCancelButton();
    setupInputListeners();
  }

  function setupSubmitButton(thisform) {
    console.log(`setupSubmitButton .`, thisform);

    ('use strict');
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        'submit',
        (event) => {
          event.preventDefault();
          if (!form.checkValidity()) {
            console.log(`!form.checkValidity .`);

            event.stopPropagation();
          } else {
            console.log(`xxxxxxxxxxx.checkValidity .`);

            formSubmitted(thisform); // Call formSubmitted if the form is valid
          }

          form.classList.add('was-validated');
        },
        false
      );
    });
  }

  function setupInputListeners() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('change', function () {
        // Get data attributes usings vanilla JavaScript
        const data = this.dataset;
        handleEvent(this.value, data);
      });
    });
  }

  function setupCancelButton() {
    const cancelButton = document.querySelector('.cancel-button');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => formCancelled());
    }
  }

  function setupAddButton(list) {
    const addButton = list.container.querySelector('.add-item');
    if (addButton) {
      addButton.addEventListener('click', () => list.addNewItem());
    }
  }

  function setupSaveButton(list) {
    console.log(`setupSaveButton .`);
    const saveButton = document.querySelector('.btn-primary');
    if (saveButton) {
      saveButton.addEventListener('click', () => list.handleSave());
    }
  }

  function renderList(list) {
    // Clear existing content while preserving the container
    list.container.innerHTML = '';

    // Add existing items
    list.items.forEach((_, index) => {
      list.container.insertAdjacentHTML('beforeend', list.createRowHTML(index));
      list.setupRowListeners(index);
    });

    // Add the "Add New" button after the items
    list.container.insertAdjacentHTML(
      'beforeend',
      `
      <div class="add-button-container mt-3 mb-4">
        <button type="button" class="btn btn-secondary btn-sm add-item">
          ${list.getAddButtonText()}
        </button>
      </div>
    `
    );

    list.addButtonContainer = list.container.querySelector(
      '.add-button-container'
    );
  }

  class DynamicList {
    constructor(container, ItemClass, itemType) {
      this.container = container;
      this.ItemClass = ItemClass;
      this.itemType = itemType;
      this.items = [];
      this.init();
    }

    init() {
      this.render();
    }

    addItem(itemData = {}) {
      const item = new this.ItemClass(
        itemData.name || '',
        itemData.id || '',
        itemData.type || ''
      );
      this.items.push(item);
      this.render();
    }

    addNewItem() {
      const index = this.items.length;
      this.items.push(new this.ItemClass());
      this.container.insertBefore(
        this.createElementFromHTML(this.createRowHTML(index)),
        this.addButtonContainer
      );
      this.setupRowListeners(index);
      this.checkFormCompletion();
    }

    createElementFromHTML(htmlString) {
      const div = document.createElement('div');
      div.innerHTML = htmlString.trim();
      return div.firstChild;
    }

    render() {
      renderList(this);
      setupListeners(this);
    }

    checkFormCompletion() {
      const lastIndex = this.items.length - 1;
      const lastItem = this.items[lastIndex];

      if (!lastItem) return;

      this.addButtonContainer?.classList.toggle(
        'd-none',
        !lastItem.isComplete()
      );
    }

    async handleSave() {
      console.log(`handleSave this.items ${this.items} .`);

      const validItems = this.items.filter((item) => item.isComplete());

      if (validItems.length === 0) {
        console.log(
          `Please add at least one complete ${this.itemType} before saving.`
        );
      }

      try {
        console.log(
          `Saving ${this.itemType}s:`,
          validItems.map((item) => item.toJSON())
        );
        // alert(`${this.itemType}s saved successfully!`);
      } catch (error) {
        console.error(`Error saving ${this.itemType}s:`, error);
        //  alert(`Error saving ${this.itemType}s. Please try again.`);
      }
    }

    setupRowListeners(index) {
      const row = this.container.querySelector(`[data-index="${index}"]`);

      // Input listeners
      const nameInput = row.querySelector(`.${this.itemType}-name`);
      const idInput = row.querySelector(`.${this.itemType}-id`);
      const typeSelect = row.querySelector(`.${this.itemType}-type`);

      nameInput?.addEventListener('input', (e) => {
        this.items[index].name = e.target.value;
        this.checkFormCompletion();
      });

      idInput?.addEventListener('input', (e) => {
        this.items[index].id = e.target.value;
        this.checkFormCompletion();
      });

      typeSelect?.addEventListener('change', (e) => {
        this.items[index].type = e.target.value;
        this.checkFormCompletion();
      });

      // Remove button listener
      row.querySelector('.remove-item')?.addEventListener('click', () => {
        row.remove();
        this.items.splice(index, 1);
        // Reindex remaining items
        this.container
          .querySelectorAll(`.klaviyo-${this.itemType}`)
          .forEach((row, i) => {
            row.setAttribute('data-index', i);
          });
        this.checkFormCompletion();
      });
    }
  }

  class KlaviyoFlow {
    constructor(name = '', id = '', type = '') {
      this.name = name;
      this.id = id;
      this.type = type;
    }

    isComplete() {
      return (
        this.name.trim() !== '' &&
        this.id.trim() !== '' &&
        this.type.trim() !== ''
      );
    }

    toJSON() {
      return {
        name: this.name,
        id: this.id,
        type: this.type,
      };
    }
  }

  class KlaviyoList {
    constructor(name = '', id = '', type = '') {
      this.name = name;
      this.id = id;
      this.type = type;
    }

    isComplete() {
      return (
        this.name.trim() !== '' &&
        this.id.trim() !== '' &&
        this.type.trim() !== ''
      );
    }

    toJSON() {
      return {
        name: this.name,
        id: this.id,
        type: this.type,
      };
    }
  }

  class KlaviyoMetric {
    constructor(name = '', id = '', type = '') {
      this.name = name;
      this.id = id;
      this.type = type;
    }

    isComplete() {
      return (
        this.name.trim() !== '' &&
        this.id.trim() !== '' &&
        this.type.trim() !== ''
      );
    }

    toJSON() {
      return {
        name: this.name,
        id: this.id,
        type: this.type,
      };
    }
  }

  class KlaviyoSection {
    constructor(container, title, type) {
      this.container = container;
      this.title = title;
      this.type = type;
      this.render();
    }

    render() {
      this.container.innerHTML = `
        <div class="col-12 mb-4">
          <h5 class="font-semibold mb-3">${this.title}</h5>
          <div class="klaviyo-${this.type}-container"></div>
        </div>
      `;
      return this.container.querySelector(`.klaviyo-${this.type}-container`);
    }
  }

  class KlaviyoMetricsList extends DynamicList {
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
                <option value="count" ${
                  this.items[index]?.type === 'count' ? 'selected' : ''
                }>Count</option>
                <option value="revenue" ${
                  this.items[index]?.type === 'revenue' ? 'selected' : ''
                }>Revenue</option>
                <option value="conversion" ${
                  this.items[index]?.type === 'conversion' ? 'selected' : ''
                }>Conversion</option>
              </select>
            </div>
          </div>
          ${
            index > 0
              ? `
            <div class="col-12 mt-2">
              <button type="button" class="btn btn-danger btn-sm remove-item">
                Remove Metric
              </button>
            </div>
          `
              : ''
          }
        </div>
      `;
    }

    getAddButtonText() {
      return 'Add New Metric';
    }
  }

  class KlaviyoListsList extends DynamicList {
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
                <option value="marketing" ${
                  this.items[index]?.type === 'marketing' ? 'selected' : ''
                } >Marketing</option>
                <option value="subscribers" ${
                  this.items[index]?.type === 'subscribers' ? 'selected' : ''
                } >Subscribers</option>
                <option value="customers" ${
                  this.items[index]?.type === 'customers' ? 'selected' : ''
                } >Customers</option>
              </select>
            </div>
          </div>
          ${
            index > 0
              ? `
            <div class="col-12 mt-2">
              <button type="button" class="btn btn-danger btn-sm remove-item">
                Remove List
              </button>
            </div>
          `
              : ''
          }
        </div>
      `;
    }

    getAddButtonText() {
      return 'Add New List';
    }
  }

  class KlaviyoFlowsList extends DynamicList {
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
                <option value="newsletter" ${
                  this.items[index]?.type === 'newsletter' ? 'selected' : ''
                } >Newsletter</option>
                <option value="promotional" ${
                  this.items[index]?.type === 'promotional' ? 'selected' : ''
                } >Promotional</option>
                <option value="transactional" ${
                  this.items[index]?.type === 'transactional' ? 'selected' : ''
                } >Transactional</option>
              </select>
            </div>
          </div>
          ${
            index > 0
              ? `
            <div class="col-12 mt-2">
              <button type="button" class="btn btn-danger btn-sm remove-item">
                Remove Flow
              </button>
            </div>
          `
              : ''
          }
        </div>
      `;
    }

    getAddButtonText() {
      return 'Add New Flow';
    }
  }

  class KlaviyoForm {
    constructor(container) {
      this.container = container;
      this.dynamicLists = [];
      this.init();
    }

    async init() {
      await this.loadData();
      this.render();

      setupMightyListeners(this);
    }

    async loadData() {
      const data = form_data;
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
                      data-field="klaviyo_company_id"
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
                      data-field="klavio_private_token"
                      required
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
                  <button type="button" class="btn btn-neutral me-2 cancel-button">Cancel</button>
                  <button type="submit" class="btn btn-primary submit-button">Save</button>
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
        this.formData.klaviyo_flows.forEach((flow) => {
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
        this.formData.klaviyo_metrics.forEach((metric) => {
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
        this.formData.klaviyo_lists.forEach((list) => {
          listsList.addItem({
            name: list.category,
            id: list.list_id,
            type: 'marketing', // Default type since it's not in the sample data
          });
        });
      }

      this.dynamicLists.push(flowsList, metricsList, listsList);
    }
  }
  const formElement = document.getElementById(`f_form_`);

  //const formElement = container;
  //console.log("formElement", formElement);

  const dynamicForm = new KlaviyoForm(container);
  //console.log("dynamicForm start", dynamicForm);
}
