# Google Sheets Setup — SimulateCraft Agent Form

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: `SimulateCraft Agents`
4. In **Row 1**, add these column headers (one per cell):

| Col | Header |
|-----|--------|
| A | Timestamp |
| B | Name |
| C | Gender |
| D | Role |
| E | Department |
| F | Role Detail |
| G | Speech Style |
| H | Goal |
| I | Under Pressure |
| J | With Others |
| K | Pet Peeve |
| L | Soft Spot |
| M | Catchphrase |
| N | Day Life |
| O | Openness |
| P | Conscientiousness |
| Q | Extraversion |
| R | Agreeableness |
| S | Neuroticism |
| T | Skin URL |
| U | Fun Fact |
| V | Persona |

5. **Format Row 1 as bold** so it stays as a header.

> **Import tip:** SimulateCraft bulk import can use `Persona` as the system prompt and `Goal` as the agent goal. The other columns are extras for analysis / richer prompts later.

---

## Step 2: Open Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Paste the code below
4. Click **Save** (Ctrl+S)
5. Name the project: `AgentFormScript`

---

## Step 3: Apps Script Code

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Apps Script sometimes wraps JSON in e.postData.contents;
  // text/plain from the form still lands here as a string.
  const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
  const data = JSON.parse(raw);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Name", "Gender", "Role", "Department", "Role Detail",
      "Speech Style", "Goal", "Under Pressure", "With Others",
      "Pet Peeve", "Soft Spot", "Catchphrase", "Day Life",
      "Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism",
      "Skin URL", "Fun Fact", "Persona"
    ]);
  }

  const personality = data.personality || {};
  const dayLife = Array.isArray(data.day_life)
    ? data.day_life.join("; ")
    : (data.day_life_text || data.day_life || "");

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.gender || "",
    data.role || "",
    data.department || "",
    data.role_detail || "",
    data.speech_style || "",
    data.campus_goal || data.goal || "",
    data.under_pressure || "",
    data.with_others || "",
    data.pet_peeve || "",
    data.soft_spot || "",
    data.catchphrase || "",
    dayLife,
    personality.O != null ? personality.O : (data.openness || 0),
    personality.C != null ? personality.C : (data.conscientiousness || 0),
    personality.E != null ? personality.E : (data.extraversion || 0),
    personality.A != null ? personality.A : (data.agreeableness || 0),
    personality.N != null ? personality.N : (data.neuroticism || 0),
    data.skin_url || "",
    data.fun_fact || "",
    data.persona || ""
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
2. Gear icon → **Web app**
3. Fill in:
   - **Description:** `Agent Form Receiver`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. Copy the Web app URL (`…/exec`)
6. Click **Done**

> If you already deployed an older script, create a **new** deployment after pasting this code — old URLs do not pick up changes.

---

## Step 5: Connect to Your Form

1. Open `form.js`
2. Find `SHEETS_URL` at the top
3. Paste your Web app URL
4. Save

---

## Step 6: Test It

1. Open `ned-form.html` (or `python -m http.server 5500`)
2. Fill the form (all 20 quiz items), click **Preview persona**, then **Submit Agent**
3. Confirm a new row appears — especially the **Persona** column

---

## Troubleshooting

- **CORS / "can't confirm":** The form tries CORS first, then falls back to `no-cors`. Check the sheet either way.
- **No data in sheet:** Redeploy as **Anyone**, and make sure you created a **new** deployment after editing the script.
- **Old columns only:** Add the new header cells in row 1, or start a fresh sheet with the table above.
- **Persona empty:** Update `form.js` — older versions did not send `persona`.

---

## Optional: Add More Columns Later

1. Add the header in Row 1  
2. Add the field in `ned-form.html`  
3. Add it to `collectPayload()` / `buildPersonaPrompt()` in `form.js`  
4. Append it in `sheet.appendRow()` in Apps Script  
5. **New deployment** of the web app  
