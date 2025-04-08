export function extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileName = `${parts[parts.length - 2]}/${parts[parts.length-1]}`;
    return fileName.split('.')[0]; // remove extension
  }