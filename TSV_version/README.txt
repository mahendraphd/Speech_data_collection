TSV SPEECH RECORDER - GOOGLE DRIVE + GITHUB PAGES

FILES
1. index.html  - upload to your GitHub Pages repository.
2. Code.gs     - deploy as a Google Apps Script Web App.

SETUP
1. Put your .tsv file in Google Drive.
2. Copy its file ID from the Drive URL.
3. Create a Google Drive folder for recordings and copy its folder ID.
4. Open Code.gs and set:
   const TSV_FILE_ID = 'YOUR_TSV_FILE_ID';
   const DRIVE_FOLDER_ID = 'YOUR_RECORDING_FOLDER_ID';
5. If the first TSV row is a header, set HAS_HEADER = true.
6. TEXT_COLUMN_INDEX = 0 uses the first TSV column as the sentence.
7. Deploy Code.gs as Web App:
   Execute as: Me
   Who has access: Anyone
8. The uploaded index.html already contains your current Apps Script URL:
   https://script.google.com/macros/s/AKfycbwUXvrXQ6vKIJBJ2s_IkaXuesO-dzZATT9CwsTEhhlK077OLXrLnmYHvCc2X4LAwf41aQ/exec
   If you create a new Apps Script deployment, replace UPLOAD_URL in index.html.
9. Upload index.html to GitHub Pages and open the HTTPS GitHub Pages URL on the phone.

WORKFLOW
- Enter Name, Gender and Age.
- Click "Load Samples from Google Drive".
- Sentence 1 appears.
- Click Record and read it.
- Click Stop.
- Review audio and click Save Recording.
- Click Next Sentence.
- Repeat until all TSV sentences are completed.

Each audio file is saved to the configured Drive folder. A JSON metadata file is also saved with
participant information, sample number, sentence, duration, audio filename/file ID and timestamp.

TSV FORMAT
The default is one sentence in the first column:
Hello, how are you?
This is a sample sentence.
Please read this sentence.

If your TSV has multiple columns, change TEXT_COLUMN_INDEX.


ID-BASED TSV
------------
Your TSV should contain:
ID<TAB>Text

Example:
10001<TAB>Hello, how are you?
10002<TAB>This is the second sentence.
10003<TAB>Please read this sentence clearly.

The first column is ID and the second is Text.
Set ID_COLUMN_INDEX and TEXT_COLUMN_INDEX if needed.

START FROM A GIVEN ID
---------------------
After loading the TSV, enter an ID in "Starting ID" and click "Start from ID".
The page finds that exact ID and begins from that row.
Next Sentence then follows the original TSV order.

The ID is shown on screen, included in the audio filename, and saved as sampleId in metadata.
