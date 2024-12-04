import { titleCase } from '@/utils/strings'
import Papa from 'papaparse';

export async function parseFile(file: File) {

  if (file.type === 'text/csv') {
    return parseCSV(file);
  } else if (file.type === 'application/json') {
    // TODO: Get Json parsing working
    return parseJson(file);
  }
}

export async function parseCSV(file: File) {
  return new Promise<any[]>((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      transform: (value) => {
        // Clean and Format the string to title case
        // Can add more checks and tests here if required
        let cleanedStr = value.trim()
        let formattedStr = titleCase(cleanedStr)

        return formattedStr
      },
      error: reject
    });
  });
}

export async function parseJson(file: File) {
  return new Promise<any[]>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
}
