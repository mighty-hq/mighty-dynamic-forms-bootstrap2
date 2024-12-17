export class KlaviyoMetric {
  constructor(name = '', id = '', type = '') {
    this.name = name;
    this.id = id;
    this.type = type;
  }

  isComplete() {
    return this.name.trim() !== '' && 
           this.id.trim() !== '' && 
           this.type.trim() !== '';
  }

  toJSON() {
    return {
      name: this.name,
      id: this.id,
      type: this.type
    };
  }
}