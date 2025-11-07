
export const fileToBase64 = (file: File): Promise<{ base64Data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result includes the data URL prefix "data:image/png;base64,", we need to remove it.
      const base64Data = result.split(',')[1];
      const mimeType = result.split(';')[0].split(':')[1];
      if (base64Data && mimeType) {
        resolve({ base64Data, mimeType });
      } else {
        reject(new Error('Failed to parse file data.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
