MAX_FILE_SIZE = 10000000;

var uploadFile = function(e) {
  var file = e.target.files[0];

	var xhr = new XMLHttpRequest();
	if (xhr.upload && file.size <= MAX_FILE_SIZE) {
    // progress bar
		xhr.upload.addEventListener("progress", function(e) {
			var percent = parseInt(100 - (e.loaded / e.total * 100));
      drawProgress(percent);
		}, false);

    // file received/failed
		xhr.onreadystatechange = function(e) {
			if (xhr.readyState == 4) {
				progress.className = (xhr.status == 200 ? "success" : "failure");
			}
		};

		// start upload
    var form = document.getElementById('form');
		xhr.open("POST", form.action, true);
    var formData = new FormData();
    formData.append('video', file, file.name);
		xhr.send(formData);
    form.style.display = 'none';
    
		var progress = document.getElementById("progress");
    progress.style.display = 'block';
	}
}

var drawProgress = function(percent) {
  if (percent <= 50) {
    document.getElementById('right-side').style.display = 'none';
    document.getElementById('pie').style.clip = 'rect(0, 200px, 200px, 100px)';
  } else {
    document.getElementById('right-side').style.display = 'block';
    document.getElementById('right-side').style.transform = 'rotate(180deg)';
    document.getElementById('pie').style.clip = 'rect(auto, auto, auto, auto)';
  }
  document.getElementById('left-side').style.transform = 'rotate(' + (percent * 3.6) + 'deg)';
  document.getElementById('progress-number').innerHTML = percent;
}

document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('file').addEventListener('change', uploadFile, false);
  var percent = 0;
  // setInterval(function() { drawProgress(percent++ % 100) }, 100);
});
