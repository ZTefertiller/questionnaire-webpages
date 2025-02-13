let inactivityLink = 'https://app.prolific.com/submissions/complete?cc=C2K5DEKR';
let abortStudyLink = 'https://app.prolific.com/submissions/complete?cc=C1J0QVQM';
let noConsentLink = 'https://app.prolific.com/submissions/complete?cc=C1H9VW2B';
let studyCompletedLink = 'https://app.prolific.com/submissions/complete?cc=C9FL91J6'

function abortStudy() {
    if (confirm("Are you sure you want to abort the study? You will be redirected to Prolific and marked as incomplete.")) {
        studyInProgress = false;
        jatos.endStudyAndRedirect(abortStudyLink);
    }
}

window.noConsentLink = noConsentLink

document.addEventListener("DOMContentLoaded", function() {
    // Or if you already have the variable from prolificLinks.js:
    const noConsentLink = window.noConsentLink; // if it's already defined

    const anchor = document.getElementById("noConsentLink");
    anchor.setAttribute("href", window.noConsentLink); 
    // or simpler:
    anchor.href = window.noConsentLink;
});

window.inactivityLink = inactivityLink