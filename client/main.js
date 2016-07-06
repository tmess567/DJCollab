import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import jsmediatags from 'jsmediatags';
import { MP3S } from '../imports/collections.js';

import './main.html';
$( document ).ready( function(){
	$('input.jqUploadclass').change(function(e){
		$('#album').text("undefined");
		$('#artist').text("undefined");
		$('#genre').text("undefined");
		$('#title').text("undefined");
		$('#track').text("undefined");
		var file = e.currentTarget.files[0];
		console.log(file);
		jsmediatags.read(file, {
			onSuccess: function(tag) {
				console.log(tag);
				$('#album').text(tag.tags.album);
				$('#artist').text(tag.tags.artist);
				$('#genre').text(tag.tags.genre);
				$('#title').text(tag.tags.title);
				$('#track').text(tag.tags.track);
				var image = tag.tags.picture;
		          if (image) {
		          	$('#picture').show();
		            var base64String = "";
		            for (var i = 0; i < image.data.length; i++) {
		                base64String += String.fromCharCode(image.data[i]);
		            }
		            var base64 = "data:" + image.format + ";base64," +
		                    window.btoa(base64String);
		            document.getElementById('picture').setAttribute('src',base64);
		          } else {
		          	$('#picture').hide();
		          	document.getElementById('picture').setAttribute('src','/unavailable.png');
		          }

		        $('#data').show();
			},
			onError: function(error) {
				console.log(':(', error.type, error.info);
			}
		});
	});
});

Template.body.helpers({
  mp3s: MP3S.find(),
  callbacks: function(){
  	return {
  		finished: function(index, fileInfo, templateContext) {
  			//console.log(fileInfo);
  			jsmediatags.read(fileInfo.url, {
				onSuccess: function(tag) {
					var pic = "";
					var image = tag.tags.picture;
					if (image) {
			            var base64String = "";
			            for (var i = 0; i < image.data.length; i++) {
			                base64String += String.fromCharCode(image.data[i]);
			            }
			            var base64 = "data:" + image.format + ";base64," +
			                    window.btoa(base64String);
						pic = base64;
			          } else {
			          	pic = "/unavailable.png"
			          }
					MP3S.insert({
						album: tag.tags.album || "undefined",
						artist: tag.tags.artist || "undefined",
						genre: tag.tags.genre || "undefined",
						title: tag.tags.title || "undefined",
						track: tag.tags.track || "undefined",
						picture: pic,
						filename: fileInfo.name,
						url: fileInfo.url
					});
				}
			});
  		}
  	}
  }
});