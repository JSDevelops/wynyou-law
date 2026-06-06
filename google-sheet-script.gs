function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // หากเป็นชีตเปล่า ให้เขียนหัวตารางอัตโนมัติ
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["วัน-เวลาที่ส่ง", "ชื่อ-นามสกุล", "เบอร์โทรศัพท์", "อีเมล", "บริการที่สนใจ", "รายละเอียดข้อความ"]);
      // ปรับแต่งสีหัวตาราง
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#c5a880"); // สีทองโลโก้เว็บ
      headerRange.setFontColor("#ffffff");
    }
    
    // ดึงค่าที่ส่งมาจากแบบฟอร์มบนเว็บ
    var name = e.parameter.name || "";
    var phone = e.parameter.phone || "";
    var email = e.parameter.email || "";
    var service = e.parameter.service || "";
    var message = e.parameter.message || "";
    var timestamp = new Date();
    
    // แปลงฟอร์แมตวันเวลาเป็นวันไทย
    var formattedDate = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    
    // เขียนแถวข้อมูลใหม่ลงสเปรดชีต
    sheet.appendRow([formattedDate, name, phone, email, service, message]);
    
    // ตอบกลับผลลัพธ์
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "บันทึกข้อมูลสำเร็จ"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}
