class LocalStorageService {
  private AUTH_TOKEN_KEY = "auth-token";

  read = <T>(key: string, defaultValue?: T): T => {
    key = this.resolveNamespacedKey(key);
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item) as T;
    return defaultValue as T;
  };

  write = <T>(key: string, value: T) => {
    key = this.resolveNamespacedKey(key);
    try {
      if (value) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      /* ignore storage errors */
    }
  };

  readAuthToken() {
    return this.read<string>(this.AUTH_TOKEN_KEY);
  }

  writeAuthToken(value: string | undefined) {
    this.write(this.AUTH_TOKEN_KEY, value);
  }

  private resolveNamespacedKey(key: string) {
    return `career-os:${key}`;
  }
}

export default new LocalStorageService();
