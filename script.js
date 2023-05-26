/*on click: show*/
function myFunction() {
  var x = document.getElementById("box1");
  if (x.style.display === "none") {
  x.style.display = "block";
  } else {
  x.style.display = "none";
  } 
}

/*UPLOAD*/
$(function() {
  $("input:file[id=file-upload]").change(function() {
      $("#file-upload-value").html( $(this).val() );
  });
});