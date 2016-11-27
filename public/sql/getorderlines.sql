SELECT a.line_seq_no, a.qty_ordered, a.uom, b.user_def_fld_1, b.user_def_fld_2, a.item_no, c.qty_on_hand, a.item_desc_1, a.item_desc_2, b.item_weight, c.picking_seq
FROM [511].[dbo].[oeordlin_sql] a
LEFT OUTER JOIN [511].[dbo].[imitmidx_sql] b ON a.item_no = b.item_no
LEFT OUTER JOIN [511].[dbo].[iminvloc_sql] c ON b.item_no = c.item_no
WHERE ord_no = @sonum AND c.loc = 'CBC'