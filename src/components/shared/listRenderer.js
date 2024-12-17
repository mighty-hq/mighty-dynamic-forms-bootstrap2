export function renderList(list) {
  // Clear existing content while preserving the container
  list.container.innerHTML = '';
  
  // Add existing items
  list.items.forEach((_, index) => {
    list.container.insertAdjacentHTML('beforeend', list.createRowHTML(index));
    list.setupRowListeners(index);
  });

  // Add the "Add New" button after the items
  list.container.insertAdjacentHTML('beforeend', `
    <div class="add-button-container mt-3 mb-4">
      <button type="button" class="btn btn-secondary btn-sm add-item">
        ${list.getAddButtonText()}
      </button>
    </div>
  `);

  list.addButtonContainer = list.container.querySelector('.add-button-container');
}