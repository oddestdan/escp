class LS {
  getItem(key: string, defaultValue = ""): string {
    return this.checkLS()
      ? localStorage.getItem(key) || defaultValue
      : defaultValue;
  }

  setItem(key: string, value: string | number): void {
    this.checkLS() && localStorage.setItem(key, `${value}`);
  }

  private checkLS(): boolean {
    return typeof window !== "undefined";
  }
}

export const ls = new LS();
