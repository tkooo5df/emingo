import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface DataExportProps {
  data: any[];
  filename: string;
  title?: string;
}

const DataExport = ({ data, filename, title }: DataExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const exportToCSV = () => {
    if (data.length === 0) {
      toast({
        title: t('export.noData'),
        description: t('export.noDataDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();

      toast({
        title: t('export.success'),
        description: t('export.csvSuccess'),
      });
    } catch (error) {
      toast({
        title: t('export.error'),
        description: t('export.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    if (data.length === 0) {
      toast({
        title: t('export.noData'),
        description: t('export.noDataDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();

      toast({
        title: t('export.success'),
        description: t('export.jsonSuccess'),
      });
    } catch (error) {
      toast({
        title: t('export.error'),
        description: t('export.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    // For now, export as CSV which can be opened in Excel
    exportToCSV();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {title || t('export.export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {t('export.csv')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="w-4 h-4 mr-2" />
          {t('export.json')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileText className="w-4 h-4 mr-2" />
          {t('export.excel')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataExport;
