const pathToFolder = '.\\folder_to_rename_files_inside';
const fileExt = [
   'txt',
   'mp3'
];

var fs = require('fs');

function getFileMaskRegExp(fileExt) {
   var fileMask = '';
   for (var i = 0, len = fileExt.length || 0; i < len; i++) {
      fileMask += '\\.' + fileExt[i] + '$' + (i !== len - 1 ? '|' : '');
   }
   return fileMask ? RegExp(fileMask) : null;
}

function getNumbersArr(length) {
   var arr = Array(length),
      prefix = (length + ''),
      numOfDigits = prefix.length;

   prefix = prefix.replace(/\d/g, '0');

   for (var i = 0; i < length; i++) {
      arr[i] = (prefix + (i + 1)).match(RegExp('\\d{' + numOfDigits + '}$')) + '';
   }

   return arr.sort(function(a,b){
      return Math.random() - 0.5;
   });
}

function getNewFileName(index, name) {
   return newNumbers[index] + ' - ' + name.replace(/^\d* - /, '');
}

var filesBuffer = fs.readdirSync(pathToFolder),
   filesCount = filesBuffer && filesBuffer.length || 0,
   fileMaskRegExp = getFileMaskRegExp(fileExt),
   newNumbers = filesCount ? getNumbersArr(filesCount) : 0,
   curFileName;

for (var i = 0; i < filesCount; i++) {
   curFileName = filesBuffer[i] || '';
   if (~curFileName.match(fileMaskRegExp)) {
      fs.renameSync(pathToFolder + '\\' + curFileName, pathToFolder + '\\' + getNewFileName(i, curFileName));
   }
}