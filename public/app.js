MAX_FILE_SIZE = 100000000;

var el = function(id) {
  return document.getElementById(id);
}

var prepareUpload = function(e) {
  var file = e.target.files[0];
	if (!(new XMLHttpRequest()).upload) {
    el('message').innerHTML = 'Dein Gerät wird leider nicht unterstützt.';
  } else if (file.size > MAX_FILE_SIZE) {
    el('message').innerHTML = 'Dein Video ist zu lang. Bitte beschränke dich auf 30 Sekunden.';
  } else {
    uploadFile(file);
  }
}

var uploadFile = function(file) {
  var xhr = new XMLHttpRequest();
  // listen to progress
	xhr.upload.addEventListener('progress', function(e) {
    if (e.lengthComputable) {
  		var percent = parseInt(e.loaded / e.total * 100);
      drawProgress(percent);
    }
	}, false);

  // file received/failed
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState === 4) {
      setCompleted(xhr.status);
		}
	};

	// start upload
  var form = el('form');
	xhr.open('POST', form.action, true);
  var formData = new FormData();
  formData.append('video', file, file.name);
	xhr.send(formData);

  form.style.display = 'none';
  el('progress').style.display = 'block';
  el('message').innerHTML = '';
}

var drawProgress = function(percent) {
  if (percent <= 50) {
    el('right-side').style.display = 'none';
    el('pie').style.clip = 'rect(0, 200px, 200px, 100px)';
  } else {
    el('right-side').style.display = 'block';
    el('right-side').style.transform = 'rotate(180deg)';
    el('pie').style.clip = 'rect(auto, auto, auto, auto)';
  }
  el('left-side').style.transform = 'rotate(' + (percent * 3.6) + 'deg)';
  el('progress-number').innerHTML = percent;
}

var setCompleted = function(status) {
  var progress = el('progress');
  var message = el('message');
  drawProgress(100);
  if (status === 200) {
    progress.className = 'success';
    message.innerHTML = 'Merci beaucoup! Dein Video wurde hinzugefügt.';
  } else {
    progress.className = 'failure';
    message.innerHTML = 'Hoppla, das hat leider nicht geklappt. ' +
                        'Versuch es später nochmals oder sonst mit einem anderen Gerät.';
  }
  setTimeout(function() {
    el('form').style.display = 'block';
    progress.style.display = 'none';
    progress.className = null;
    }, 5000);
}

document.addEventListener("DOMContentLoaded", function(event) {
  el('file').addEventListener('change', prepareUpload, false);
  var percent = 0;
  // setInterval(function() { drawProgress(percent++ % 100) }, 100);
});
