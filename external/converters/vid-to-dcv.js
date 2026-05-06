import {spawn} from 'node:child_process'
import {readdir, readFile, writeFile} from 'node:fs/promises'
for(const file of await fstat.readdir('./in')){
    const vd = spawn('ffmpeg', [
        '-i', 
    ])
}
/*

ai overview reference

const { spawn } = require('child_process');

// Command to output every 20th frame as image data (PNG)
const ffmpeg = spawn('ffmpeg', [
  '-i', 'input.mp4',
  '-vf', 'select=not(mod(n,20))',
  '-vsync', 'vfr',
  '-f', 'image2pipe',
  '-vcodec', 'png',
  '-'
]);

ffmpeg.stdout.on('data', (data) => {
  // Process raw buffer 'data' here (e.g., send to OpenCV, Jimp)
  console.log('Received a frame...');
});

ffmpeg.on('close', () => console.log('Finished'));

*/