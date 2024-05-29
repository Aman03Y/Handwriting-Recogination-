import React from 'react'

function Navbar() {
    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://cloudlabs-image-ocr.p.rapidapi.com/ocr/recognizeUrl',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '066cabc675msh83ddef8ebcd1ea1p10608ejsn78f976353a06',
            'X-RapidAPI-Host': 'cloudlabs-image-ocr.p.rapidapi.com'
        },
        processData: false,
        data: '{\r"url": "https://i.ibb.co/QKKDSvz/handwriting.jpg"\r}'
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
  return (
    <div>{setting}</div>
  )
}

export default Navbar