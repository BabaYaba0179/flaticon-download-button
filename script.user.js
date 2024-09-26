// ==UserScript==
// @name         Flaticon SVG Downloader
// @version      1.0
// @description  Download SVG icons from Flaticon.
// @author       BabaYaga0179
// @namespace    https://github.com/BabaYaga0179/
// @match        *://www.flaticon.com/*
// @grant        none
// @icon        https://www.flaticon.com/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    // Function to add download button to page
    function addDownloadButton() {
        const targetElement = document.getElementById('fi-premium-download-buttons');
        if (!targetElement) return;

        const existingButton = document.getElementById('custom-download-button');
        if (existingButton) return; // Avoid adding buttons multiple times

        const downloadButton = document.createElement('a');
        downloadButton.href = '#';
        downloadButton.className = 'btn col mg-none bj-button bj-button--primary';
        downloadButton.id = 'custom-download-button';
        downloadButton.innerHTML = '<span>Download SVG</span>';
        downloadButton.addEventListener('click', (event) => {
            event.preventDefault();
            downloadSVG();
        });

        targetElement.appendChild(downloadButton);
    }

    // SVG download function
    function downloadSVG() {
        var url = window.location.href.split("?")[0];
        var filename = url.split("/")[url.split("/").length - 1];
        var id = filename.split("_")[1];
        if (!id) {
            alert("You can only download an SVG icon while viewing an icon.");
            return;
        }
        var onlyName = filename.split("_")[0];

        function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.setAttribute("download", name);
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        var loggedin = document.getElementById("gr_connected");
        if (!loggedin) {
            alert("Please login before clicking on me.");
            return;
        }

        fetch("https://www.flaticon.com/editor/icon/svg/" + id + "?type=standard")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            if (!data.url) {
                throw new Error("Invalid response data");
            }
            downloadURI(data.url, onlyName + ".svg");
        })
        .catch((error) => {
            console.error("Error downloading SVG:", error);
            alert("Something went wrong >.<");
        });
    }

    // Create MutationObserver to monitor changes in DOM
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                addDownloadButton();
            }
        }
    });

    // Start viewing the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Call the download button constructor if the target element already exists in the DOM
    addDownloadButton();

})();
