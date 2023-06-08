const ffmpeg = require('fluent-ffmpeg');

const resizeImage = (inputPath, outputPath, width) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(`-vf scale=${width}:-1`)
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}

module.exports = resizeImage;