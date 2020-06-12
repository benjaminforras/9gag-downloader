// ==UserScript==
// @name         9gag-downloader
// @namespace    https://github.com/TryHardDood/9gag-downloader/
// @version      0.2
// @description  Downloads videos and images from 9gag using FileSaver
// @author       TryHardDood
// @require      https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @match        *://*.9gag.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';
    console.log('9GAG Downloader loading');
    const htmlTemplate = '<ul class="btn-vote right download"><li><a href="javascript:void(0);" rel="nofollow" class="down">Download</a></li></ul>';

    document.querySelectorAll('div.main-wrap section article .post-afterbar-a:not(.full-width)').forEach((value) => {
        if (!value.querySelector('ul.download')) {
            value.insertAdjacentHTML('beforeend', htmlTemplate);
        }
    });

    if(!MutationObserver) {
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    }

    let obs = new MutationObserver(function () {
        document.querySelectorAll('div.main-wrap section article .post-afterbar-a:not(.full-width)').forEach((value) => {
            if (!value.querySelector('ul.download')) {
                value.insertAdjacentHTML('beforeend', htmlTemplate);
            }
        });
    });

    obs.observe(document.querySelector('div.main-wrap section'), {
        childList: true
    });

    document.addEventListener("click", function (event) {
        if (!event.target || !event.target.classList.contains('down')) return;

        event.preventDefault();

        const post = event.target.closest('article').querySelector('.post-container');
        let url;
        if (post.querySelector('img')) {
            url = post.querySelector('img').src;
        } else if (post.querySelector('video')) {
            url = post.querySelector('video').querySelector('source[type="video/mp4"]').src;
        }
        forceDownload(url, url.substring(url.lastIndexOf('/') + 1));
    });

    console.log('9GAG Downloaded loaded.');
})();

function forceDownload(url, fileName) {
    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        onprogress: (e) => {
            var percent = Math.round((e.loaded / e.total) * 100);
            console.log(percent + ' %');
        },
        onload: (response) => {
            if (response.status !== 200) {
                console.error(response);
                return;
            }

            var blob = response.response;
            saveAs(blob, fileName);
        },
        onerror: function(err) {
            console.error(err);
        },
    });
}
