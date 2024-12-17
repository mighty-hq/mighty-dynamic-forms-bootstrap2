export class KlaviyoSection {
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