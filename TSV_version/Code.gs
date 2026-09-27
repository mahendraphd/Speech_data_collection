// ===== Research Speech Recorder Backend =====
// TSV columns: ID <TAB> Text
// Deploy this file as a Google Apps Script Web App.
// Execute as: Me
// Who has access: Anyone

const TSV_FILE_ID = '1rbssHhTBaqbG16JgCSUJ3y7Xe-RCntFA';
const DRIVE_FOLDER_ID = '1e8aNbj4E2beLrhxIFC7QxbEuHdNo9cKY';

const HAS_HEADER = false;
const ID_COLUMN_INDEX = 0;
const TEXT_COLUMN_INDEX = 1;

function doGet(e) {
  try {
    if ((e.parameter.action || '') === 'samples') {
      return json_({success:true, samples:readTSV_()});
    }
    return json_({success:true,message:'Speech recorder API is running.'});
  } catch (err) {
    return json_({success:false,message:String(err.message || err)});
  }
}

function doPost(e) {
  try {
    const p=e.parameter||{};
    if ((p.action||'upload')!=='upload') throw new Error('Unknown action.');
    if (!p.audioBase64) throw new Error('Audio data is missing.');
    if (!p.name) throw new Error('Participant name is missing.');

    const folder=DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const bytes=Utilities.base64Decode(p.audioBase64);
    const mime=p.mimeType||'audio/webm';
    const audio=Utilities.newBlob(bytes,mime,p.fileName||('recording_'+Date.now()+'.webm'));
    const audioFile=folder.createFile(audio);

    const metadata={
      name:p.name, gender:p.gender||'', age:p.age||'',
      sampleNumber:Number(p.sampleNumber||0),
      sampleId:p.sampleId||'',
      sentence:p.sentence||'',
      durationSeconds:Number(p.durationSeconds||0),
      mimeType:mime, audioFileName:audioFile.getName(),
      audioFileId:audioFile.getId(), uploadedAt:new Date().toISOString()
    };

    folder.createFile(
      'metadata_'+safe_(p.name)+'_ID_'+safe_(p.sampleId||'')+'_'+Date.now()+'.json',
      JSON.stringify(metadata,null,2), MimeType.PLAIN_TEXT
    );
    return json_({success:true,fileId:audioFile.getId()});
  } catch(err) {
    return json_({success:false,message:String(err.message||err)});
  }
}

function readTSV_() {
  if(TSV_FILE_ID==='PASTE_TSV_FILE_ID_HERE') throw new Error('Set TSV_FILE_ID in Code.gs.');
  const file=DriveApp.getFileById(TSV_FILE_ID);
  const text=file.getBlob().getDataAsString('UTF-8').replace(/^\uFEFF/,'');
  const lines=text.split(/\r?\n/);
  const out=[];

  lines.forEach(function(line,i){
    if(HAS_HEADER&&i===0)return;
    if(!line.trim())return;
    const cols=parseTSV_(line);
    const id=(cols[ID_COLUMN_INDEX]||'').trim();
    const sentence=(cols[TEXT_COLUMN_INDEX]||'').trim();
    if(id&&sentence) out.push({id:id,text:sentence,number:out.length+1});
  });
  return out;
}

function parseTSV_(line){
  const result=[];let current='';let quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted&&line[i+1]==='"'){current+='"';i++;}
      else quoted=!quoted;
    }else if(ch==='\t'&&!quoted){result.push(current);current='';}
    else current+=ch;
  }
  result.push(current);
  return result;
}

function safe_(s){
  return String(s).replace(/[^a-zA-Z0-9_-]/g,'_').replace(/_+/g,'_').substring(0,50);
}
function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
