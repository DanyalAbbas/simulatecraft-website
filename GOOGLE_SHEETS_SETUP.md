# Google Sheets Setup — SimulateCraft Agent Form

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: `SimulateCraft Agents`
4. In **Row 1**, add these column headers (one per cell):

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Gender | Role | Department | Openness | Conscientiousness | Extraversion | Agreeableness | Neuroticism | Skin URL | Fun Fact |

5. **Format Row 1 as bold** (select row → Ctrl+B) so it stays as a header.

---

## Step 2: Open Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Paste the code below
4. Click **Save** (floppy disk icon or Ctrl+S)
5. Name the project: `AgentFormScript`

---

## Step 3: Apps Script Code

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // If headers haven't been set yet, add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Name", "Gender", "Role", "Department",
      "Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism",
      "Skin URL", "Fun Fact"
    ]);
  }

  const personality = data.personality || {};

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.gender || "",
    data.role || "",
    data.department || "",
    personality.O || 0,
    personality.C || 0,
    personality.E || 0,
    personality.A || 0,
    personality.N || 0,
    data.skin_url || "",
    data.fun_fact || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Step 4: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Fill in:
   - **Description:** `Agent Form Receiver`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. **Copy the Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. Click **Done**

---

## Step 5: Connect to Your Form

1. Open `form.js` in your code editor
2. Find this line at the top:
   ```javascript
   const SHEETS_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
3. Replace with your copied URL:
   ```javascript
   const SHEETS_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
4. Save the file

---

## Step 6: Test It

1. Open `ned-form.html` in a browser (or via `python -m http.server 5500`)
2. Fill out the form and submit
3. Check your Google Sheet — the data should appear as a new row

---

## Troubleshooting

- **"Error submitting" message:** Make sure the Apps Script URL is correct and ends with `/exec`
- **CORS errors:** Normal for Apps Script — `mode: "no-cors"` handles this, but you won't see the response. The data still goes through.
- **No data in sheet:** Make sure you deployed as "Anyone" access and the script is saved
- **To update the script after changes:** Go to Extensions → Apps Script → modify → Deploy → New deployment (create a new one, the old URL won't update)

---

## Optional: Add More Columns Later

If you want to add more fields to the form later:
1. Add the new column header in the Google Sheet (Row 1)
2. Add the field to `ned-form.html`
3. Add the field to the `data` object in `form.js`
4. Add the column to the `sheet.appendRow()` call in Apps Script
