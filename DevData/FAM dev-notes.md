


CREATE TABLE "Action" (
	"actionId"	INTEGER,
	"cattleId"	TEXT NOT NULL,
	"feedId"	TEXT NOT NULL,
	"feedType"	TEXT NOT NULL,
	"quantity"	REAL NOT NULL,
	"actionTime"	NUMERIC NOT NULL,
	"status"	TEXT NOT NULL,
	PRIMARY KEY("actionId")
) WITHOUT ROWID


CREATE TABLE Action ( actionId INTEGER, cattleId TEXT NOT NULL, feedId TEXT NOT NULL, feedType TEXT NOT NULL, quantity REAL NOT NULL, actionTime NUMERIC NOT NULL, status TEXT NOT NULL, PRIMARY KEY(actionId) ) WITHOUT ROWID


CREATE TABLE "CageScan" (
	"actionId"	INTEGER NOT NULL,
	"scanId"	INTEGER,
	"qr"	TEXT NOT NULL,
	"quantity"	REAL NOT NULL,
	"picturePaths"	TEXT NOT NULL,
	"status"	TEXT NOT NULL,
	PRIMARY KEY("scanId")
) WITHOUT ROWID


CREATE TABLE CageScan ( actionId INTEGER NOT NULL, scanId INTEGER, qr TEXT NOT NULL, quantity REAL NOT NULL, picturePaths TEXT NOT NULL, status TEXT NOT NULL, PRIMARY KEY(scanId) ) WITHOUT ROWID
