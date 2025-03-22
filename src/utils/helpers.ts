export function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info'): void {
  const styles = {
    info: 'color: #3498db',
    success: 'color: #2ecc71',
    error: 'color: #e74c3c',
    warn: 'color: #f39c12'
  };

  console.log(`%c${message}`, styles[type]);
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
