import { setupListeners } from './listHandlers.js';
import { renderList } from './listRenderer.js';

export class DynamicList {
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

    this.addButtonContainer?.classList.toggle('d-none', !lastItem.isComplete());
  }

  async handleSave() {
    const validItems = this.items.filter(item => item.isComplete());
    
    if (validItems.length === 0) {
      alert(`Please add at least one complete ${this.itemType} before saving.`);
      return;
    }

    try {
      console.log(`Saving ${this.itemType}s:`, validItems.map(item => item.toJSON()));
      alert(`${this.itemType}s saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${this.itemType}s:`, error);
      alert(`Error saving ${this.itemType}s. Please try again.`);
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
      this.container.querySelectorAll(`.klaviyo-${this.itemType}`).forEach((row, i) => {
        row.setAttribute('data-index', i);
      });
      this.checkFormCompletion();
    });
  }
}