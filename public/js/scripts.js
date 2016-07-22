function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function allTitleCase(inStr) { return inStr.replace(/\w\S*/g, function(tStr) { return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase(); }); }
