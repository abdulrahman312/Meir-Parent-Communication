// THIS CODE MUST BE PASTED INTO THE GOOGLE APPS SCRIPT EDITOR
// Link to Sheet: https://docs.google.com/spreadsheets/d/1SY5WTq4IJS22avFKJY7wB7E-0LKCjWNT-qtHFqYJnUU/edit
// Instructions:
// 1. Open the Spreadsheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste this code into 'Code.gs'.
// 4. Click Deploy > New Deployment.
// 5. Select type 'Web app'.
// 6. Set 'Execute as' to 'Me' (your email).
// 7. Set 'Who has access' to 'Anyone' (IMPORTANT).
// 8. Copy the 'Web app URL' and paste it into 'constants.tsx' in your React project.

var SPREADSHEET_ID = '1SY5WTq4IJS22avFKJY7wB7E-0LKCjWNT-qtHFqYJnUU';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var request = JSON.parse(e.postData.contents);
    var action = request.action;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (action === 'submit') {
      return handleSubmit(ss, request.sheetName, request.payload);
    } else if (action === 'resolve') {
      return handleResolve(ss, request.sheetName, request.rowIndex, request.adminName);
    }

    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Invalid action" })).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": e.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  // We use doGet mainly for fetching data for the Admin panel
  // Ideally, use a parameter ?action=fetchAll
  var action = e.parameter.action;
  
  if (action === 'fetchAll') {
     var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
     var allData = [];
     var sheetNames = [
       "Academic Support Request",
       "Administrative Support Request",
       "Student Behavior & Well-Being Report",
       "School Visit Request"
     ];
     
     sheetNames.forEach(function(name) {
       var sheet = ss.getSheetByName(name);
       if (sheet) {
         // Get all data starting from row 2
         var lastRow = sheet.getLastRow();
         if (lastRow > 1) {
           var data = sheet.getRange(2, 1, lastRow - 1, 14).getValues(); // A to N is 14 columns
           
           data.forEach(function(row, index) {
             // We add rowIndex (actual row number in sheet = index + 2)
             allData.push({
               rowIndex: index + 2,
               sheetName: name,
               timestamp: row[0],
               parentName: row[1],
               contactNumber: row[2],
               studentName: row[3],
               grade: row[4],
               section: row[5],
               schoolLevel: row[6],
               reason: row[7],
               previouslyContacted: row[8],
               officialName: row[9],
               officialResponded: row[10],
               details: row[11],
               status: row[12], // Column M
               solvedBy: row[13] // Column N
             });
           });
         }
       }
     });
     
     return ContentService.createTextOutput(JSON.stringify({ "status": "success", "data": allData })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ "status": "ready" })).setMimeType(ContentService.MimeType.JSON);
}


function handleSubmit(ss, sheetName, data) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Sheet not found" })).setMimeType(ContentService.MimeType.JSON);

  var timestamp = new Date();
  
  // Mapping FormData to Columns
  // A: Timestamp, B: Parent, C: Contact, D: Student, E: Grade, F: Section, G: School, H: Reason
  // I: PrevContact, J: OfficialName, K: DidRespond, L: Details, M: Status (0), N: SolvedBy (Empty)
  
  var row = [
    timestamp,
    data.parentName,
    data.contactNumber,
    data.studentName,
    data.grade,
    data.section,
    data.schoolLevel,
    data.reason,
    data.previouslyContacted,
    data.officialName || "",
    data.officialResponded || "",
    data.details,
    0, // Initial Status
    "" // Initial Solved By
  ];

  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({ "status": "success" })).setMimeType(ContentService.MimeType.JSON);
}

function handleResolve(ss, sheetName, rowIndex, adminName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Sheet not found" })).setMimeType(ContentService.MimeType.JSON);

  // Status is Column M (13th column), SolvedBy is Column N (14th column)
  sheet.getRange(rowIndex, 13).setValue(1);
  sheet.getRange(rowIndex, 14).setValue(adminName);
  
  return ContentService.createTextOutput(JSON.stringify({ "status": "success" })).setMimeType(ContentService.MimeType.JSON);
}
