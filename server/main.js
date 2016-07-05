import { Meteor } from 'meteor/meteor';
import '../imports/collections.js';

Meteor.startup(() => {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.upload/audio/tmp',
    uploadDir: process.env.PWD + '/.upload/audio/',
    checkCreateDirectories: true,
    acceptFileTypes: /.(mp3)$/i
  });
});
