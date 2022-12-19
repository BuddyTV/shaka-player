
var _prefetchedManifests = [];

function _addManifest(url, manifest) {
   for (let i = 0; i < _prefetchedManifests.length; i++) {
      let item = _prefetchedManifests[i];
      if (item[0] == url) {
         item[1] = manifest;
         return;
      }
   }

   _prefetchedManifests.push([url, manifest]);

   if (_prefetchedManifests.length > 3)
   {
       _prefetchedManifests.shift();
   }
}

function _normalizeMasterManifest(baseUrl, text) {
   let lines = text.split("\n");
   for (let i = 0; i < lines.length; i++) {
      if (/^http/.test(lines[i])) continue;

      let ext_x_media_url = lines[i].match(/^#EXT-X-MEDIA:.+,URI=\"(.+?\.m3u8)\"/);
      if (ext_x_media_url && ext_x_media_url.length > 0) {
          if (/^http/.test(ext_x_media_url[1])) continue;
          let url = new URL(ext_x_media_url[1], baseUrl);
          lines[i] = lines[i].replace(ext_x_media_url[1], url.toString());
          continue;
      }

      if (/^#/.test(lines[i])) continue;

      if (/.m3u8$/.test(lines[i])) {
         let url = new URL(lines[i], baseUrl);
         lines[i] = url.toString();
      }
   }
   return lines.join("\n");
}

function prefetch(url) {
    // console.log('yuri prefetch', url);
    fetch(url)
       .then(function(response) {
           if ((response.status !== 200) || 
              !((response.headers.get('Content-Type') == "application/x-mpegURL") ||
               (response.headers.get('Content-Type') == "application/vnd.apple.mpegurl"))) {
              console.log("prefetch failed");
              return;
           }
           let urlObj = new URL(
               response.redirected ? response.url : url);
           response.text().then(function(text) {
           let baseUrl = urlObj.origin + urlObj.pathname;
              let masterManifest = _normalizeMasterManifest(baseUrl, text);
              _addManifest(url, masterManifest);
           });
       })
       .catch(function(err) {
           console.log("Preetch error: ", err);
       });
}

function get_prefetched(url) {
    for (let i = 0; i < _prefetchedManifests.length; i++) {
        let item = _prefetchedManifests[i];
        if (item[0] == url) {
            return "data:application/x-mpegURL;base64," + btoa(item[1]);
        }
    }
    return url;
}
