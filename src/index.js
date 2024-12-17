import './styles.scss';
//import { KlaviyoForm } from './forms/KlaviyoForm.js';
import { formbubble } from './forms/KlaviyoFormBubble.js';
import { loadKlaviyoData } from './utils/dataLoader.js';

// document.addEventListener('DOMContentLoaded', async () => {
//   const container = document.getElementById('form-container');
//   new KlaviyoForm(container);
// });

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('form-container');

  const data = await loadKlaviyoData();
  let dynamicFormHtml = `
    <form class="row g-3 needs-validation" id="f_form_" novalidate>
    </form>
  `;

  container.innerHTML = dynamicFormHtml;
  const formElement = document.getElementById(`f_form_`);

  formbubble(formElement, data);
});
