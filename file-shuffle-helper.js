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

   return arr;
}

function shuffle(arr) {
   var j, x, i;
   for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = arr[i];
      arr[i] = arr[j];
      arr[j] = x;
   }
   return arr;
}

function getChangesStat(shuffledArr) {
   var areas = [],
      totalAreasAmount = 0,
      samePositions = [],
      maxAreaLength = 0,
      curArea,
      continueArea = false,
      isArea = false;
   for (var i = 0, len = shuffledArr.length; i < len; i++) {
      continueArea = i < len-1 && +shuffledArr[i+1] - +shuffledArr[i] === 1;
      if (continueArea) {
         if (!areas.length || !isArea) {
            curArea = [];
            areas.push(curArea);
            isArea = true;
         }
      }
      if (isArea) {
         curArea.push(i);
         if(curArea.length > maxAreaLength) {
            maxAreaLength = curArea.length;
         }
         totalAreasAmount++;
         isArea = continueArea
      }
      if (+shuffledArr[i] === i+1) {
         samePositions.push(i);
      }
   }

   return {
      areas: areas,
      areasAmount: totalAreasAmount,
      areasMaxLength: maxAreaLength,
      samePosElements: samePositions
   }
}

function validateShuffleResult(shuffledArr) {
   var len = shuffledArr.length,
      stat = getChangesStat(shuffledArr),
      percentOfRepetedAreas = len ? stat.areasAmount / len : 1;
   return percentOfRepetedAreas < 0.05 && stat.areasMaxLength < 3
}

function getNewFileName(index, name) {
   return shuffledNumbers[index] + ' - ' + name.replace(/^\d* - /, '');
}

var filesBuffer = fs.readdirSync(pathToFolder),
   filesCount = filesBuffer && filesBuffer.length || 0,
   fileMaskRegExp = getFileMaskRegExp(fileExt),
   numbers = filesCount ? getNumbersArr(filesCount) : 0,
   shuffledNumbers = shuffle(numbers.slice()),
   fileNamePrefixRegExp = RegExp('^\\d* - '),
   curFileName;

while (!validateShuffleResult(shuffledNumbers)) {
   shuffle(shuffledNumbers);
}

filesCount && filesBuffer.sort(function(a, b) {
   var clearA = a.replace(fileNamePrefixRegExp, ''),
      clearB = b.replace(fileNamePrefixRegExp, '');
   return clearA < clearB ? -1 : +(clearA > clearB);
});

for (var i = 0; i < filesCount; i++) {
   curFileName = filesBuffer[i] || '';
   if (~curFileName.match(fileMaskRegExp)) {
      fs.renameSync(pathToFolder + '\\' + curFileName, pathToFolder + '\\' + getNewFileName(i, curFileName));
   }
}