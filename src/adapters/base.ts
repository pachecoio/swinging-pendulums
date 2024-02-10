export interface Broker {
  on(event: string, callback: Function): void;
  emit(event: string, data: any): void;
  removeListener(event: string, callback: Function): void;
}
