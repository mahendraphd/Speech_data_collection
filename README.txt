SIMPLE RESEARCH AUDIO RECORDER
================================

WHAT IT STORES
Participant fields:
- Name
- Gender
- Age

Recording metadata:
- Duration
- Audio filename
- Google Drive file ID
- Upload timestamp

The browser remembers Name, Gender and Age using localStorage.
They stay filled for the next recording and after page refresh.
They change only when the user edits them.

FILES
-----
Recorder.html  = recording webpage
Code.gs        = Google Apps Script backend

SETUP
-----

1. GOOGLE DRIVE
Create a Google Drive folder where you want the recordings stored.

Open the folder. Its URL looks like:
https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXX

Copy only the XXXXXXXXXXXXXXXX part.

2. GOOGLE APPS SCRIPT
Open:
https://script.google.com/

Create a New Project.

Delete the default code and paste the contents of Code.gs.

Replace:
PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE

with your Google Drive folder ID.

Save the project.

3. DEPLOY THE BACKEND
Click:
Deploy > New deployment

Choose:
Web app

Set:
Execute as: Me
Who has access: Anyone

Click Deploy.

Authorize Google Drive access if requested.

Copy the Web App URL. It should end with:
/exec

4. CONFIGURE THE WEB PAGE
Open Recorder.html in a text editor.

Find:
PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE

Replace it with your Apps Script /exec URL.

Save Recorder.html.

5. HOST THE PAGE
Microphone access requires HTTPS.

You can host Recorder.html using GitHub Pages or another HTTPS web host.

6. USE
Open the webpage.
Enter Name, Gender and Age once.
Click Record.
Allow microphone access.
Click Stop.
Listen using the playback control.
Click Save to Google Drive.

For the next recording, Name, Gender and Age remain filled.

IMPORTANT
---------
If you update Code.gs after deployment, create/update the Web App deployment
so that the deployed version uses your latest code.

If collecting research data from people, obtain appropriate consent and
protect access to identifiable participant information.
