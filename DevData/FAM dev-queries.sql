/*

-- ============================================
-- = SQLite

select a.actionId actionId, cattleId, feedId, feedType, a.quantity quantity, actionTime, a.status status, 
scanId, qr, s.quantity s_quantity, picturePaths, s.status s_status 
from Action a 
inner join CageScan s on a.actionId = s.actionId

-- unupload action
SELECT * FROM Action A
WHERE (STATUS = 'new' OR STATUS = 'cancelled')

-- unupload scan
SELECT * FROM CageScan A
WHERE (STATUS = 'new' OR STATUS = 'cancelled')

-- unupload action OR action with unupload Scan
SELECT * FROM Action A
WHERE (STATUS = 'new' OR STATUS = 'cancelled')
	OR EXISTS (SELECT 1 FROM CageScan S 
		WHERE A.ACTIONID = S.ACTIONID AND (S.STATUS = 'new' OR STATUS = 'cancelled'))

		
select 1 from Action 
where  EXTSTS (select 1 FROM Action WHERE status <> 'Uploaded')
	OR EXTSTS (select 1 FROM CageScan WHERE status <> 'Uploaded')

*/

