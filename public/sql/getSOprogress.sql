SELECT [Barcode],[timecreate],[timefin],[line_no],[unit_no],[procedure],[process],[so_num],[station] FROM [ExcelDataImport].[dbo].[ProductionDetailTable]
WHERE [so_num] = @sonum