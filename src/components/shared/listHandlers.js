export function setupListeners(list) {
  setupAddButton(list);
  setupSaveButton(list);
}

function setupAddButton(list) {
  const addButton = list.container.querySelector('.add-item');
  if (addButton) {
    addButton.addEventListener('click', () => list.addNewItem());
  }
}

function setupSaveButton(list) {
  const saveButton = document.querySelector('.btn-primary');
  if (saveButton) {
    saveButton.addEventListener('click', () => list.handleSave());
  }
}