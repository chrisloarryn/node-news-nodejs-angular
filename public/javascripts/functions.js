formatDate = function (time) {
    /*
    * JavaScript Pretty Date
    * Copyright (c) 2008 John Resig (jquery.com)
    * Licensed under the MIT license.
        */
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);
                            
        if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
        return;
        var v = day_diff == 0 && (
            diff < 60 && "just now" ||
            diff < 120 && "1 minute ago" ||
            diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
            diff < 7200 && "1 hour ago" ||
            diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
            day_diff == 1 && "Yesterday" ||
            day_diff < 7 && day_diff + " days ago" ||
            day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
            if (!v)
                window.console && console.log(time);
            return v ? v : '';
};

// Stores the URL of the 'deleted' news in localStorage() 
// so don't show them again
bindBtnDeleteOnClick = function(title) {
    var imgs = document.querySelectorAll(".btnDelete")
    Array.from(imgs).forEach((imgElement) => {
        imgElement.addEventListener('click', function (event) {
            var urlDeleted = imgElement.parentNode.previousSibling.previousSibling.querySelector('a').href;
            var linkElement = imgElement.parentNode.previousSibling.previousSibling;
            deleteNewsByUrl_LocalStorage(urlDeleted)
            hideRow(linkElement)
        })
    })
}
deleteNewsByUrl_LocalStorage = function(urlDeleted) {
    localStorage["deletedNews"] = localStorage["deletedNews"].concat(urlDeleted)
}
hideRow = function(postElement) {
    postElement.classList.add('hideNews')
    postElement.nextSibling.classList.add('hideNews')
    postElement.nextSibling.nextSibling.classList.add('hideNews')
}
hideDeletedNews = function() {
    var postUrls = document.querySelectorAll(".post-url")
    var deletedNews = localStorage["deletedNews"] || ""
    postUrls.forEach((linkElement) => {
        if (deletedNews.indexOf(linkElement.href) > -1) {
            console.log(linkElement.href)
            hideRow(linkElement.parentNode)
        }
    })
}

// Parse all ugly-dates into prettyDates
prettifyDates = function () {
    document.querySelectorAll('.prettyDate').forEach( date => {
        date.textContent = formatDate(date.textContent)
    })
}

bindBtnDeleteOnClick()
hideDeletedNews()
prettifyDates()
