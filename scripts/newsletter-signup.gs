const SPREADSHEET_ID = "114m4AcjBXCd20eh17H4EqjXePJpBWeWf3qHagdtWN3Y";
const NOTIFICATION_EMAIL = "noidungxanh@gmail.com";
const SHEET_NAME = "Danh sách thành viên";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("NEWSLETTER_SECRET");

    if (!expectedSecret || data.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    const email = String(data.email || "").trim().toLowerCase();
    if (!email || email.indexOf("@") < 1) {
      return jsonResponse({ ok: false, error: "Invalid email" });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders(sheet);

    const existingEmails = sheet.getLastRow() > 1
      ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getDisplayValues().flat()
      : [];
    const isExisting = existingEmails.some(function (value) {
      return String(value).trim().toLowerCase() === email;
    });

    if (!isExisting) {
      const subscribedAt = data.subscribedAt ? new Date(data.subscribedAt) : new Date();
      sheet.appendRow([
        sheet.getLastRow(),
        email,
        subscribedAt,
        String(data.source || "Website"),
        "Đang theo dõi"
      ]);
      sheet.getRange(sheet.getLastRow(), 3).setNumberFormat("dd/MM/yyyy HH:mm:ss");

      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: "Có thành viên mới đăng ký Nội Dung Xanh",
        htmlBody:
          "<p>Có một thành viên mới đăng ký nhận bài viết:</p>" +
          "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>" +
          "<p><strong>Nguồn:</strong> " + escapeHtml(String(data.source || "Website")) + "</p>" +
          "<p><a href=\"https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit\">Xem danh sách email</a></p>"
      });
    }

    return jsonResponse({ ok: true, existing: isExisting });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function ensureHeaders(sheet) {
  const headers = [["STT", "Email", "Thời gian đăng ký", "Nguồn đăng ký", "Trạng thái"]];
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers[0].length)
      .setBackground("#237a60")
      .setFontColor("#ffffff")
      .setFontWeight("bold");
    sheet.setColumnWidth(1, 60);
    sheet.setColumnWidth(2, 260);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 220);
    sheet.setColumnWidth(5, 130);
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[character];
  });
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
