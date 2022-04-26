import { Injectable } from '@nestjs/common';
import { ExportToCsv } from 'export-to-csv';

@Injectable()
export class ExportService {
  public handle(header, data) {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      useBom: true,
      showLabels: true,
      useKeysAsHeaders: false,
      headers: header,
    };
    const csvExporter = new ExportToCsv(options);

    if (Array.isArray(data) && data.length === 0) {
      data = [{}];
    }
    const _csv = '\ufeff' + csvExporter.generateCsv(data, true);
    return _csv;
  }
}
