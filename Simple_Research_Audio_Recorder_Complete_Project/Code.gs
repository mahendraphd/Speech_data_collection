/*
Google Apps Script backend for the simplified recorder.

SETUP:
1. Create a folder in Google Drive.
2. Copy the folder ID and paste it below.
3. Deploy this Apps Script as a Web App:
   Execute as: Me
   Who has access: Anyone
4. Copy the /exec URL into Recorder.html.

Each upload creates:
- the audio file
- a small JSON metadata file containing Name, Gender, Age,
  duration, audio filename and upload time.
*/

const DRIVE_FOLDER_ID = '1e8aNbj4E2beLrhxIFC7QxbEuHdNo9cKY';

function doGet() {
  return ContentService
    .createTextOutput('Research Audio Recorder upload endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const p = e.parameter || {};
    if (!p.audioBase64) throw new Error('No audio data received.');

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

    const name = clean_(p.name || 'Unknown');
    const mimeType = p.mimeType || 'audio/webm';
    const extension = mimeType.indexOf('ogg') >= 0 ? 'ogg' : 'webm';

    let fileName = cleanFile_(p.fileName || ('recording_' + Date.now() + '.' + extension));

    const bytes = Utilities.base64Decode(p.audioBase64);
    const audioBlob = Utilities.newBlob(bytes, mimeType, fileName);
    const audioFile = folder.createFile(audioBlob);

    const baseName = fileName.replace(/\.[^.]+$/, '');

    const metadata = {
      name: p.name || '',
      gender: p.gender || '',
      age: p.age || '',
      durationSeconds: p.durationSeconds || '',
      audioFileName: audioFile.getName(),
      recordedFileId: audioFile.getId(),
      uploadedAt: new Date().toISOString()
    };

    folder.createFile(
      baseName + '_metadata.json',
      JSON.stringify(metadata, null, 2),
      MimeType.PLAIN_TEXT
    );

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        fileName: audioFile.getName(),
        fileId: audioFile.getId()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: String(err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function clean_(value) {
  return String(value).replace(/[\\/:*?"<>|#%{}]/g, '_').slice(0,100);
}

function cleanFile_(value) {
  return String(value).replace(/[\\/:*?"<>|#%{}]/g, '_').slice(0,150);
}
