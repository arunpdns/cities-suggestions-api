export class TsvParser {
  delimiter = '\t';
  newLine = '\n';
  parse(data: string): Array<unknown> {
    const lines = data.split(this.newLine);
    if (lines.length == 0) {
      return [];
    }
    const result = [];
    const headers = lines[0].split(this.delimiter);
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(this.delimiter);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }
}
